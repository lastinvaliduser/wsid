import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { urlSegmentToCategory, CATEGORY_LABELS, categoryToUrlSegment } from "@/lib/category"
import { PostContent } from "@/components/public/PostContent"
import { ShareToolbar } from "@/components/public/ShareToolbar"
import { ScrollProgress } from "@/components/public/ScrollProgress"
import { AuthorCard } from "@/components/public/AuthorCard"
import readingTime from "reading-time"

interface PageProps {
  params: Promise<{ category: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: segment, slug } = await params
  const category = urlSegmentToCategory(segment)
  if (!category) return {}

  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, coverImage: true, category: true, publishedAt: true, status: true },
  })

  if (!post || post.status !== "PUBLISHED") return {}

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const postUrl = `${appUrl}/${segment}/${slug}`
  const ogImageUrl = `${appUrl}/api/og?slug=${encodeURIComponent(slug)}`

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      type: "article",
      url: postUrl,
      title: post.title,
      description: post.excerpt ?? undefined,
      publishedTime: post.publishedAt?.toISOString(),
      section: CATEGORY_LABELS[post.category],
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: [ogImageUrl],
    },
  }
}

export default async function PostPage({ params }: PageProps) {
  const { category: segment, slug } = await params
  const category = urlSegmentToCategory(segment)
  if (!category) notFound()

  const [post, settings] = await Promise.all([
    prisma.post.findUnique({
      where: { slug },
    }),
    prisma.setting.findMany({
      where: { key: { in: ["site.avatar", "site.bio"] } },
    }),
  ])

  if (!post || post.status !== "PUBLISHED" || post.category !== category) notFound()

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]))
  const readingStats = readingTime(post.content)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const postUrl = `${appUrl}/${segment}/${slug}`

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : null

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.coverImage ?? undefined,
    author: {
      "@type": "Person",
      name: "CreoVibe Coding",
      email: "creovibecoding@gmail.com",
    },
    publisher: {
      "@type": "Organization",
      name: "CreoVibe Coding",
    },
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    url: postUrl,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollProgress />

      <article className="max-w-2xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
        >
          <span className="mr-2">←</span> Back to Home
        </Link>

        {/* Post header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-500">
              {CATEGORY_LABELS[post.category]}
            </span>
            <span className="text-gray-300">·</span>
            {formattedDate && (
              <time className="text-sm text-gray-500" dateTime={post.publishedAt?.toISOString()}>
                {formattedDate}
              </time>
            )}
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-500">
              {Math.ceil(readingStats.minutes)} min read
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight tracking-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-3 text-xl text-gray-500">{post.excerpt}</p>
          )}
        </header>

        {/* Cover image */}
        {post.coverImage && (
          <div className="mb-10 rounded-xl overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={800}
              height={450}
              className="w-full aspect-video object-cover"
              priority
            />
          </div>
        )}

        {/* Post content */}
        <PostContent markdown={post.content} />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Share toolbar (inline for mobile/tablet) */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-400 mb-3">Share this post</p>
          <ShareToolbar title={post.title} url={postUrl} sticky={false} />
        </div>

        {/* Author card */}
        <AuthorCard
          avatar={settingsMap["site.avatar"] || null}
          bio={settingsMap["site.bio"] || null}
        />
      </article>

      {/* Sticky share toolbar (desktop) */}
      <ShareToolbar title={post.title} url={postUrl} sticky={true} />
    </>
  )
}
