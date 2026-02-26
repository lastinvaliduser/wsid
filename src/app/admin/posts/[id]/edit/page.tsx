import { notFound } from "next/navigation"
import { Title } from "@mantine/core"
import { prisma } from "@/lib/prisma"
import { PostForm } from "@/components/admin/PostForm"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params
  const post = await prisma.post.findUnique({ where: { id } })

  if (!post) notFound()

  return (
    <div>
      <Title order={2} mb="lg">Edit Post</Title>
      <PostForm post={post} />
    </div>
  )
}
