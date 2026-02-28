import Link from "next/link"
import { ThemeToggle } from "@/components/public/ThemeToggle"

const NAV_LINKS = [
  { href: "/coding", label: "Coding" },
  { href: "/guitar", label: "Guitar" },
  { href: "/photography", label: "Photography" },
  { href: "/motorbikes", label: "Motorbikes" },
]

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight text-gray-900 dark:text-gray-100">
          wsid.now
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/about"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              About
            </Link>
          </nav>
          {/* Mobile nav — simplified, expandable in future */}
          <nav className="flex md:hidden items-center gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
