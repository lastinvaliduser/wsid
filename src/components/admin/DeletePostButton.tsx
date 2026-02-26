"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Modal, Text, Group } from "@mantine/core"
import { notifications } from "@mantine/notifications"

interface DeletePostButtonProps {
  postId: string
  postTitle: string
}

export function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
  const router = useRouter()
  const [opened, setOpened] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    const response = await fetch(`/api/posts/${postId}`, { method: "DELETE" })
    setLoading(false)

    if (response.ok) {
      setOpened(false)
      notifications.show({ title: "Deleted", message: "Post deleted.", color: "red" })
      router.refresh()
    } else {
      notifications.show({ title: "Error", message: "Failed to delete post.", color: "red" })
    }
  }

  return (
    <>
      <Button size="xs" variant="subtle" color="red" onClick={() => setOpened(true)}>
        Delete
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Delete Post"
        centered
        size="sm"
      >
        <Text size="sm" mb="lg">
          Are you sure you want to delete <strong>{postTitle}</strong>? This cannot be undone.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setOpened(false)}>
            Cancel
          </Button>
          <Button color="red" loading={loading} onClick={handleDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  )
}
