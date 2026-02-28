import Link from "next/link"
import type { Category } from "@prisma/client"
import { CATEGORY_LABELS, categoryToUrlSegment } from "@/lib/category"

interface CategoryCardProps {
  category: Category
  description: string
  postCount: number
}



export function CategoryCard({ category, description, postCount }: CategoryCardProps) {
  const href = `/${categoryToUrlSegment(category)}`

  return (
    <Link
      href={href}
      className="block border rounded-xl p-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 border-gray-200 dark:border-gray-800"
    >
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-1">
        {CATEGORY_LABELS[category]}
      </h3>
      <p className="text-sm text-gray-500 mb-3">{description}</p>
      <span className="text-xs text-gray-400">{postCount} posts</span>
    </Link>
  )
}
