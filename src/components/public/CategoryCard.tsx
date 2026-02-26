import Link from "next/link"
import type { Category } from "@prisma/client"
import { CATEGORY_LABELS, categoryToUrlSegment } from "@/lib/category"

interface CategoryCardProps {
  category: Category
  description: string
  postCount: number
}

const CATEGORY_ICON: Record<Category, string> = {
  CODING: "💻",
  GUITAR: "🎸",
  PHOTOGRAPHY: "📷",
  MOTORBIKES: "🏍️",
}

const CATEGORY_BG: Record<Category, string> = {
  CODING: "hover:bg-blue-50 border-blue-100",
  GUITAR: "hover:bg-purple-50 border-purple-100",
  PHOTOGRAPHY: "hover:bg-amber-50 border-amber-100",
  MOTORBIKES: "hover:bg-red-50 border-red-100",
}

export function CategoryCard({ category, description, postCount }: CategoryCardProps) {
  const href = `/${categoryToUrlSegment(category)}`

  return (
    <Link
      href={href}
      className={`block border rounded-xl p-6 transition-colors ${CATEGORY_BG[category]}`}
    >
      <div className="text-3xl mb-3">{CATEGORY_ICON[category]}</div>
      <h3 className="font-semibold text-gray-900 text-lg mb-1">
        {CATEGORY_LABELS[category]}
      </h3>
      <p className="text-sm text-gray-500 mb-3">{description}</p>
      <span className="text-xs text-gray-400">{postCount} posts</span>
    </Link>
  )
}
