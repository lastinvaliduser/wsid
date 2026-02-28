import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-6">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <a
              href="mailto:creovibecoding@gmail.com"
              className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
            >
              CreoVibe Coding
            </a>
          </p>
          <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">
            About
          </Link>
        </div>
        <p className="text-xs text-gray-400">wsid.now — What Should I Do Now?</p>
      </div>
    </footer>
  )
}
