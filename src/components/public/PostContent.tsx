import { MDXRemote } from "next-mdx-remote/rsc"

interface PostContentProps {
  markdown: string
}

export function PostContent({ markdown }: PostContentProps) {
  return (
    <div className="prose prose-gray prose-lg max-w-none">
      <MDXRemote source={markdown} />
    </div>
  )
}
