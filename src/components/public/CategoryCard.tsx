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
      className="block p-4 sm:p-6 transition-all hover:scale-[1.01] overflow-hidden"
      style={{
        border: "var(--border)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow)",
        fontFamily: "var(--font-main)",
        backgroundColor: "var(--background)",
      }}
    >
      <h3
        className="font-bold text-lg mb-1"
        style={{ color: 'var(--foreground)' }}
      >
        {CATEGORY_LABELS[category]}
      </h3>
      <p className="text-sm opacity-70 mb-3" style={{ color: 'var(--foreground)' }}>{description}</p>
      <span className="text-xs opacity-50" style={{ color: 'var(--foreground)' }}>{postCount} posts</span>
    </Link>
  )
}
