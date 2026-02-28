import Image from "next/image"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import type { Category } from "@prisma/client"

export const metadata: Metadata = {
  title: "About",
  description: "About CreoVibe Coding — the mind behind wsid.now",
}

const PASSION_ICON: Record<Category, string> = {
  CODING: "💻",
  GUITAR: "🎸",
  PHOTOGRAPHY: "📷",
  MOTORBIKES: "🏍️",
}

const PASSION_DESCRIPTION: Record<Category, string> = {
  CODING: "Building things on the web, exploring new technologies, and sharing what I learn.",
  GUITAR: "Playing, learning, and finding creativity through music.",
  PHOTOGRAPHY: "Capturing moments and telling stories through images.",
  MOTORBIKES: "The freedom of the open road and the community that comes with riding.",
}

const CATEGORIES: Category[] = ["CODING", "GUITAR", "PHOTOGRAPHY", "MOTORBIKES"]

export default async function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Passions */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 text-center">
          What I Write About
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => (
            <div key={cat} className="border border-gray-100 dark:border-gray-800 rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{PASSION_ICON[cat]}</div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-1">
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {PASSION_DESCRIPTION[cat]}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
