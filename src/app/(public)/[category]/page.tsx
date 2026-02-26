import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { PostCard } from "@/components/public/PostCard"
import { urlSegmentToCategory, CATEGORY_LABELS } from "@/lib/category"
import readingTime from "reading-time"

export const revalidate = 60

interface PageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

const POSTS_PER_PAGE = 10

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: segment } = await params
  const category = urlSegmentToCategory(segment)
  if (!category) return {}
  const label = CATEGORY_LABELS[category]
  return {
    title: label,
    description: `Posts about ${label.toLowerCase()} on wsid.now`,
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category: segment } = await params
  const { page: pageParam } = await searchParams
  const category = urlSegmentToCategory(segment)

  if (!category) notFound()

  const page = Math.max(1, Number(pageParam ?? "1"))

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { category, status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        content: true,
      },
    }),
    prisma.post.count({ where: { category, status: "PUBLISHED" } }),
  ])

  const totalPages = Math.ceil(total / POSTS_PER_PAGE)
  const label = CATEGORY_LABELS[category]

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{label}</h1>
        <p className="mt-2 text-gray-500">{total} post{total !== 1 ? "s" : ""}</p>
      </header>

      {/* Posts grid */}
      {posts.length === 0 ? (
        <p className="text-gray-400">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              slug={post.slug}
              category={post.category}
              excerpt={post.excerpt}
              coverImage={post.coverImage}
              publishedAt={post.publishedAt}
              readingTimeMinutes={Math.ceil(readingTime(post.content).minutes)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-12 flex items-center gap-2" aria-label="Pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/${segment}?page=${p}`}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                p === page
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {p}
            </a>
          ))}
        </nav>
      )}
    </div>
  )
}
