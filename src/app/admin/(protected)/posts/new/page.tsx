import { Title } from "@mantine/core"
import { PostForm } from "@/components/admin/PostForm"

export default function NewPostPage() {
  return (
    <div>
      <Title order={2} mb="lg">New Post</Title>
      <PostForm />
    </div>
  )
}
