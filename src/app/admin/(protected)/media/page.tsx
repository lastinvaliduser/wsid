import { prisma } from "@/lib/prisma"
import { Title, Paper, Text, Group } from "@mantine/core"
import { MediaGrid } from "@/components/admin/MediaGrid"

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div>
      <Title order={2} mb="lg">Media Library</Title>
      <Paper withBorder p="lg" radius="md" mb="xl">
        <Text size="sm" c="dimmed" mb="md">Upload images to use in your posts.</Text>
        <Text size="xs" c="dimmed">
          Supported: JPEG, PNG, WebP, GIF — Max 5MB per file
        </Text>
      </Paper>
      <Group mb="lg">
        <Text size="sm" c="dimmed">{media.length} file{media.length !== 1 ? "s" : ""}</Text>
      </Group>
      <MediaGrid media={media} />
    </div>
  )
}
