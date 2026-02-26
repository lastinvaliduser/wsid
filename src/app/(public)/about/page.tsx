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
  const settings = await prisma.setting.findMany()
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="flex flex-col sm:flex-row items-start gap-8 mb-16">
        {settingsMap["site.avatar"] ? (
          <Image
            src={settingsMap["site.avatar"]}
            alt="CreoVibe Coding"
            width={120}
            height={120}
            className="rounded-full flex-shrink-0"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-gray-500 text-3xl font-semibold">C</span>
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {settingsMap["site.author"] || "CreoVibe Coding"}
          </h1>
          <a
            href={`mailto:${settingsMap["site.email"] || "creovibecoding@gmail.com"}`}
            className="text-gray-500 hover:text-gray-900 transition-colors mt-1 block"
          >
            {settingsMap["site.email"] || "creovibecoding@gmail.com"}
          </a>
          {settingsMap["site.bio"] && (
            <p className="mt-4 text-gray-600 leading-relaxed">{settingsMap["site.bio"]}</p>
          )}

          <div className="mt-4 flex gap-4">
            {settingsMap["site.twitter"] && (
              <a
                href={`https://twitter.com/${settingsMap["site.twitter"]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                X / Twitter
              </a>
            )}
            {settingsMap["site.github"] && (
              <a
                href={`https://github.com/${settingsMap["site.github"]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Passions */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
          What I Write About
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => (
            <div key={cat} className="border border-gray-100 rounded-xl p-5">
              <div className="text-2xl mb-2">{PASSION_ICON[cat]}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{cat.charAt(0) + cat.slice(1).toLowerCase()}</h3>
              <p className="text-sm text-gray-500">{PASSION_DESCRIPTION[cat]}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
