import { prisma } from "@/lib/prisma"
import { PostCard } from "@/components/public/PostCard"
import { CATEGORY_LABELS, categoryToUrlSegment } from "@/lib/category"
import Link from "next/link"
import readingTime from "reading-time"
import type { Category } from "@prisma/client"

export const revalidate = 3600


export default async function LandingPage() {
  const [categoryCounts, recentPosts] = await Promise.all([
    prisma.post.groupBy({
      by: ["category"],
      where: { status: "PUBLISHED" },
      _count: { _all: true },
    }),
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 6,
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
  ])


  const categories: Category[] = ["CODING", "GUITAR", "PHOTOGRAPHY", "MOTORBIKES"]

  return (
    <>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight tracking-tight">
          What Should I Do Now?
        </h1>
        <p className="mt-4 text-xl text-gray-500 max-w-xl">
          Thoughts, stories, and learnings from life — coding, music, photography, and riding.
        </p>
      </section>

      {/* Category Grid */}
      <section className="max-w-5xl mx-auto px-4 pb-24 pt-10">
        <h2 className="sr-only">Explore Categories</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const href = `/${categoryToUrlSegment(cat)}`
            return (
              <Link
                key={cat}
                href={href}
                className="group flex flex-col items-center justify-center aspect-[4/3] sm:aspect-square border border-gray-200 dark:border-gray-800 rounded-2xl p-6 transition-all hover:bg-gray-50 dark:hover:bg-gray-900 hover:scale-[1.02]"
              >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg sm:text-xl tracking-widest uppercase group-hover:text-gray-600 dark:group-hover:text-gray-500 transition-colors">
                  {CATEGORY_LABELS[cat]}
                </h3>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 pb-20">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">
            Recent Posts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
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
        </section>
      )}
    </>
  )
}
