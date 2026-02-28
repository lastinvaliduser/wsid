import Image from "next/image"
import Link from "next/link"
import type { Category } from "@prisma/client"
import { CATEGORY_LABELS, categoryToUrlSegment } from "@/lib/category"

interface PostCardProps {
  title: string
  slug: string
  category: Category
  excerpt: string | null
  coverImage: string | null
  publishedAt: Date | string | null
  readingTimeMinutes: number
  compact?: boolean
}



export function PostCard({
  title,
  slug,
  category,
  excerpt,
  coverImage,
  publishedAt,
  readingTimeMinutes,
  compact = false,
}: PostCardProps) {
  const href = `/${categoryToUrlSegment(category)}/${slug}`
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : null

  return (
    <article
      className="group flex flex-col gap-3 p-4 transition-all hover:scale-[1.01]"
      style={{
        border: "var(--border)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow)",
        fontFamily: "var(--font-main)",
        backgroundColor: "var(--background)",
      }}
    >
      {!compact && coverImage && (
        <Link href={href} className="overflow-hidden" style={{ borderRadius: "calc(var(--radius) / 2)" }}>
          <Image
            src={coverImage}
            alt={title}
            width={800}
            height={450}
            className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      )}
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] uppercase font-bold px-2 py-0.5"
          style={{
            border: "var(--border)",
            borderRadius: "var(--radius)",
            backgroundColor: "var(--foreground)",
            color: "var(--background)",
            fontFamily: "var(--font-main)",
          }}
        >
          {CATEGORY_LABELS[category]}
        </span>
        {formattedDate && (
          <span className="text-[10px] opacity-60 font-mono" style={{ color: "var(--foreground)", fontFamily: "var(--font-main)" }}>{formattedDate}</span>
        )}
      </div>
      <Link href={href} className="block group/link">
        <h2
          className={`font-bold text-gray-900 dark:text-gray-100 transition-colors ${compact ? "text-sm" : "text-lg"
            }`}
          style={{ fontFamily: 'var(--font-main)', color: 'var(--foreground)' }}
        >
          {title}
        </h2>
        {!compact && excerpt && (
          <p className="mt-1 text-sm opacity-70 line-clamp-2" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-main)' }}>{excerpt}</p>
        )}
      </Link>
    </article>
  )
}
