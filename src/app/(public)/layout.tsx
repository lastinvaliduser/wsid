import { SiteNav } from "@/components/public/SiteNav"
import { SiteFooter } from "@/components/public/SiteFooter"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </>
  )
}
