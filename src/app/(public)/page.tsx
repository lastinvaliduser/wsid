import { prisma } from "@/lib/prisma"
import { PostCard } from "@/components/public/PostCard"
import { CATEGORY_LABELS, categoryToUrlSegment } from "@/lib/category"
import Link from "next/link"
import Image from "next/image"
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

  const CATEGORY_IMAGES: Record<Category, string> = {
    CODING: "/images/categories/coding.png",
    GUITAR: "/images/categories/guitar.png",
    PHOTOGRAPHY: "/images/categories/photography.png",
    MOTORBIKES: "/images/categories/motorbikes.png",
  }

  return (
    <>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-6 md:pt-12 pb-8 text-center">
        <h1
          className="font-black leading-tight tracking-tight mb-4"
          style={{
            color: 'var(--foreground)',
            fontFamily: 'var(--font-main)',
            textShadow: 'var(--shadow)',
            /* 
               SCALING: --hero-font-size is adjusted per-theme in globals.css 
               to prevent layout breakage with wide pixel fonts (Mario/GameBoy).
            */
            fontSize: 'var(--hero-font-size)'
          }}
        >
          What Should I Do Now?
        </h1>
        <p
          className="mt-2 text-[10px] uppercase tracking-[0.2em] opacity-60"
          style={{ fontFamily: "var(--font-main)" }}
        >
          Press <kbd className="px-1.5 py-0.5 rounded border" style={{ border: "var(--border)", backgroundColor: "var(--background)" }}>Cmd</kbd> + <kbd className="px-1.5 py-0.5 rounded border" style={{ border: "var(--border)", backgroundColor: "var(--background)" }}>Shift</kbd> + <kbd className="px-1.5 py-0.5 rounded border" style={{ border: "var(--border)", backgroundColor: "var(--background)" }}>F</kbd> to search
        </p>
        <p className="mt-4 text-lg opacity-70 max-w-xl mx-auto" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-main)' }}>
          Thoughts, stories, and learnings from life — coding, music, photography, and riding.
        </p>
      </section>

      {/* Category Grid */}
      <section className="max-w-5xl mx-auto px-4 pb-16 pt-4">
        <h2 className="sr-only">Explore Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((cat) => {
            const href = `/${categoryToUrlSegment(cat)}`
            return (
              <Link
                key={cat}
                href={href}
                className="group relative flex flex-col items-center justify-center aspect-square border p-4 sm:p-6 transition-all hover:scale-[1.02] overflow-hidden"
                style={{
                  backgroundColor: 'var(--background)',
                  border: 'var(--border)',
                  borderRadius: 'var(--radius)',
                  fontFamily: 'var(--font-main)',
                }}
              >
                {/* Background Image on Hover */}
                <Image
                  src={CATEGORY_IMAGES[cat]}
                  alt={CATEGORY_LABELS[cat]}
                  fill
                  className="object-cover opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-0"
                />

                <h3
                  className="relative z-10 font-black tracking-widest uppercase transition-colors text-center"
                  style={{
                    color: 'var(--foreground)',
                    textShadow: 'var(--shadow)',
                    fontSize: 'var(--cat-font-size)',
                    lineHeight: '1.2'
                  }}
                >
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
          <h2
            className="text-sm font-semibold uppercase tracking-widest mb-8 opacity-50"
            style={{ color: 'var(--foreground)', fontFamily: 'var(--font-main)' }}
          >
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
