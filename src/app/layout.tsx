import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ColorSchemeScript, MantineProvider } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import "@mantine/tiptap/styles.css"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

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
        <ColorSchemeScript />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MantineProvider>
          <Notifications position="top-right" />
          {children}
        </MantineProvider>
      </body>
    </html>
  )
}
