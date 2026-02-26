"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Modal, Text, Group, Paper } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { UploadButton } from "@uploadthing/react"
import type { UploadRouter } from "@/lib/uploadthing"
import type { Media } from "@prisma/client"

interface MediaGridProps {
  media: Media[]
}

export function MediaGrid({ media: initialMedia }: MediaGridProps) {
  const router = useRouter()
  const [media, setMedia] = useState(initialMedia)
  const [deleteTarget, setDeleteTarget] = useState<Media | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const response = await fetch(`/api/media/${deleteTarget.id}`, { method: "DELETE" })
    setDeleting(false)

    if (response.ok) {
      setMedia((prev) => prev.filter((m) => m.id !== deleteTarget.id))
      setDeleteTarget(null)
      notifications.show({ title: "Deleted", message: "Media removed.", color: "red" })
    }
  }

  function handleCopyUrl(url: string) {
    navigator.clipboard.writeText(url)
    notifications.show({ title: "Copied", message: "URL copied to clipboard.", color: "green", autoClose: 2000 })
  }

  return (
    <>
      {/* Upload button */}
      <UploadButton<UploadRouter, "imageUploader">
        endpoint="imageUploader"
        onClientUploadComplete={() => {
          notifications.show({ title: "Uploaded", message: "Image uploaded successfully.", color: "green" })
          router.refresh()
        }}
        onUploadError={(err) => {
          notifications.show({ title: "Upload failed", message: err.message, color: "red" })
        }}
      />

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {media.map((item) => (
          <Paper key={item.id} withBorder radius="md" p="xs">
            <div className="relative aspect-square overflow-hidden rounded-md mb-2">
              <Image
                src={item.url}
                alt={item.filename}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </div>
            <Text size="xs" truncate c="dimmed" mb={6}>
              {item.filename}
            </Text>
            <Group gap="xs">
              <Button size="xs" variant="light" onClick={() => handleCopyUrl(item.url)}>
                Copy URL
              </Button>
              <Button size="xs" variant="subtle" color="red" onClick={() => setDeleteTarget(item)}>
                Delete
              </Button>
            </Group>
          </Paper>
        ))}
      </div>

      {/* Delete confirm */}
      <Modal
        opened={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Media"
        centered
        size="sm"
      >
        <Text size="sm" mb="lg">
          Delete <strong>{deleteTarget?.filename}</strong>? This cannot be undone.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="red" loading={deleting} onClick={handleDelete}>Delete</Button>
        </Group>
      </Modal>
    </>
  )
}
