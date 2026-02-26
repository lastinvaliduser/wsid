export function SiteFooter() {
  return (
    <footer className="border-t border-gray-100 mt-20">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="mailto:creovibecoding@gmail.com"
            className="hover:text-gray-900 transition-colors"
          >
            CreoVibe Coding
          </a>
        </p>
        <p className="text-xs text-gray-400">wsid.now — What Should I Do Now?</p>
      </div>
    </footer>
  )
}
