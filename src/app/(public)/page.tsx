import { prisma } from "@/lib/prisma"
import { CategoryCard } from "@/components/public/CategoryCard"
import { PostCard } from "@/components/public/PostCard"
import readingTime from "reading-time"
import type { Category } from "@prisma/client"

export const revalidate = 3600

const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  CODING: "Software engineering, web development, and things I build.",
  GUITAR: "Learning, playing, and living through music.",
  PHOTOGRAPHY: "Moments captured through a lens.",
  MOTORBIKES: "Roads taken, rides remembered.",
}

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

  const countByCategory = Object.fromEntries(
    categoryCounts.map((g) => [g.category, g._count._all])
  ) as Record<Category, number>

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

      {/* Category grid */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
          Explore
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat}
              category={cat}
              description={CATEGORY_DESCRIPTIONS[cat]}
              postCount={countByCategory[cat] ?? 0}
            />
          ))}
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
