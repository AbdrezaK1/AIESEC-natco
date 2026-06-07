import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'JUMANCO | National Conference',
  description: 'A jungle-inspired national conference experience with registration, routes, campfire stories, and delegate messages.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="conference-logo-watermark" aria-hidden="true" />
        <div className="jungle-atmosphere site-wide-atmosphere" aria-hidden="true">
          <span className="jungle-leaf leaf-one" />
          <span className="jungle-leaf leaf-two" />
          <span className="jungle-leaf leaf-three" />
          <span className="jungle-vine vine-one" />
          <span className="jungle-vine vine-two" />
        </div>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
