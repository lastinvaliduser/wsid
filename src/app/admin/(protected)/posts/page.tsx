import { prisma } from "@/lib/prisma"
import { Title, Group, Button, Paper, Table, Badge, Text, Anchor } from "@mantine/core"
import Link from "next/link"
import { DeletePostButton } from "@/components/admin/DeletePostButton"
import type { PostStatus, Category } from "@prisma/client"

const STATUS_COLOR: Record<PostStatus, string> = {
  PUBLISHED: "green",
  DRAFT: "gray",
}

const CATEGORY_COLOR: Record<Category, string> = {
  CODING: "blue",
  GUITAR: "violet",
  PHOTOGRAPHY: "yellow",
  MOTORBIKES: "red",
}

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      status: true,
      publishedAt: true,
      updatedAt: true,
    },
  })

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Posts</Title>
        <Button component={Link} href="/admin/posts/new">
          New Post
        </Button>
      </Group>

      <Paper withBorder radius="md">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Published</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {posts.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text c="dimmed" ta="center" py="md">
                    No posts yet.{" "}
                    <Anchor component={Link} href="/admin/posts/new">
                      Create your first post
                    </Anchor>
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              posts.map((post) => (
                <Table.Tr key={post.id}>
                  <Table.Td>
                    <Anchor component={Link} href={`/admin/posts/${post.id}/edit`} size="sm" fw={500}>
                      {post.title}
                    </Anchor>
                  </Table.Td>
                  <Table.Td>
                    <Badge size="sm" color={CATEGORY_COLOR[post.category]} variant="light">
                      {post.category}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge size="sm" color={STATUS_COLOR[post.status]} variant="light">
                      {post.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : "—"}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button
                        component={Link}
                        href={`/admin/posts/${post.id}/edit`}
                        size="xs"
                        variant="subtle"
                      >
                        Edit
                      </Button>
                      <DeletePostButton postId={post.id} postTitle={post.title} />
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </div>
  )
}
