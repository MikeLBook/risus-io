import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { CharactersProvider } from "@/contexts/charactersContext"
import { SidebarProvider } from "@/components/ui/sidebar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Risus",
  description: "A Risus app for the boys",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased grey-bg`}>
        <SidebarProvider defaultOpen={true}>
          <CharactersProvider>{children}</CharactersProvider>
        </SidebarProvider>
      </body>
    </html>
  )
}
