import type { Metadata } from "next"
import { Lora, Geist_Mono, Orbitron, Space_Mono, Press_Start_2P, VT323 } from "next/font/google"
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import { SpotlightSearch } from "@/components/public/SpotlightSearch"
import { ThemeProvider } from "@/lib/ThemeContext"
import { SiteSidebar } from "@/components/public/SiteSidebar"
import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import "@mantine/tiptap/styles.css"
import "./globals.css"

const lora = Lora({ variable: "--font-lora", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
const orbitron = Orbitron({ variable: "--font-orbitron", subsets: ["latin"], weight: ["400", "700"] })
const spaceMono = Space_Mono({ variable: "--font-space-mono", subsets: ["latin"], weight: ["400", "700"] })
const pressStart2P = Press_Start_2P({ variable: "--font-press-start", subsets: ["latin"], weight: ["400"] })
const vt323 = VT323({ variable: "--font-vt323", subsets: ["latin"], weight: ["400"] })

const theme = createTheme({
  fontFamily: 'var(--font-main)',
  headings: { fontFamily: 'var(--font-main)' },
  primaryColor: 'gray',
})

export const metadata: Metadata = {
  title: {
    default: "wsid.now — What Should I Do Now?",
    template: "%s | wsid.now",
  },
  description: "Personal blog and portfolio by CreoVibe Coding — Coding, Guitar, Photography, Motorbikes.",
  authors: [{ name: "CreoVibe Coding", url: "https://wsid.now" }],
  creator: "CreoVibe Coding",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "wsid.now",
    title: "wsid.now — What Should I Do Now?",
    description: "Personal blog and portfolio by CreoVibe Coding.",
  },
  twitter: {
    card: "summary_large_image",
    title: "wsid.now — What Should I Do Now?",
    description: "Personal blog and portfolio by CreoVibe Coding.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${lora.variable} ${geistMono.variable} ${orbitron.variable} ${spaceMono.variable} ${pressStart2P.variable} ${vt323.variable}`}
    >
      <head>
        <ColorSchemeScript />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <MantineProvider theme={theme}>
            <Notifications />
            <SiteSidebar />
            <SpotlightSearch />
            <main className="min-h-screen pt-16 md:pt-0">
              {children}
            </main>
          </MantineProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
