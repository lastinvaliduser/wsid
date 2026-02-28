import { SiteFooter } from "@/components/public/SiteFooter"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">{children}</main>
      <SiteFooter />
    </div>
  )
}
