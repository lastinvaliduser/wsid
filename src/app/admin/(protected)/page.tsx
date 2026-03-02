import { prisma } from "@/lib/prisma"
import { Text, Title, SimpleGrid, Paper, Badge, Table, Anchor } from "@mantine/core"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const [total, published, drafts, recentDrafts] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.post.findMany({
      where: { status: "DRAFT" },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, category: true, updatedAt: true },
    }),
  ])

  const stats = [
    { label: "Total Posts", value: total },
    { label: "Published", value: published },
    { label: "Drafts", value: drafts },
  ]

  return (
    <div>
      <Title order={2} mb="lg">Dashboard</Title>

      <SimpleGrid cols={{ base: 1, sm: 3 }} mb="xl">
        {stats.map((stat) => (
          <Paper key={stat.label} withBorder p="lg" radius="md">
            <Text size="sm" c="dimmed" mb={4}>{stat.label}</Text>
            <Text size="2xl" fw={700}>{stat.value}</Text>
          </Paper>
        ))}
      </SimpleGrid>

      {recentDrafts.length > 0 && (
        <>
          <Title order={4} mb="md">Recent Drafts</Title>
          <Paper withBorder radius="md">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Title</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Last Updated</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {recentDrafts.map((post) => (
                  <Table.Tr key={post.id}>
                    <Table.Td>
                      <Anchor component={Link} href={`/admin/posts/${post.id}/edit`} size="sm">
                        {post.title}
                      </Anchor>
                    </Table.Td>
                    <Table.Td>
                      <Badge size="sm" variant="light">{post.category}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </>
      )}
    </div>
  )
}
