import type { Metadata } from "next"
import { Lora, Geist_Mono } from "next/font/google"
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import { SpotlightSearch } from "@/components/public/SpotlightSearch"
import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import "@mantine/tiptap/styles.css"
import "./globals.css"

const lora = Lora({ variable: "--font-lora", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

const theme = createTheme({
  fontFamily: `${lora.style.fontFamily}, serif`,
  headings: { fontFamily: `${lora.style.fontFamily}, serif` },
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className={`${lora.className} ${geistMono.variable} antialiased`}>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Notifications position="top-right" />
          <SpotlightSearch />
          {children}
        </MantineProvider>
      </body>
    </html>
  )
}
