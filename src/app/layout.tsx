import type { Metadata } from "next"
import { Cairo, Tajawal } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
})

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "بائعة الطيب | متجر الملابس والبخور والعطور الفاخرة",
  description:
    "متجر نسائي فاخر للملابس، البخور، والعطور الشرقية. أناقة تفوح بالفخامة.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${tajawal.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-arabic antialiased">
        <Header />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
