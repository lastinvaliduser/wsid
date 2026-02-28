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
    <article className="group flex flex-col gap-3">
      {!compact && coverImage && (
        <Link href={href} className="overflow-hidden rounded-lg">
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
          className="text-xs font-medium px-2 py-0.5 rounded-full border border-gray-200 bg-gray-50 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          {CATEGORY_LABELS[category]}
        </span>
        {formattedDate && (
          <span className="text-xs text-gray-400">{formattedDate}</span>
        )}
        <span className="text-xs text-gray-400">{readingTimeMinutes} min read</span>
      </div>
      <Link href={href} className="block group/link">
        <h2
          className={`font-semibold text-gray-900 dark:text-gray-100 group-hover/link:text-gray-600 dark:group-hover/link:text-gray-400 transition-colors ${compact ? "text-base" : "text-xl"
            }`}
        >
          {title}
        </h2>
        {!compact && excerpt && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{excerpt}</p>
        )}
      </Link>
    </article>
  )
}
