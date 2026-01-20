import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { ToastProvider } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { SessionProvider } from '@/components/session-provider'
import { DashboardLayout } from '@/components/dashboard-layout'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const equipExtended = localFont({
  src: '../assets/equip-extended.ttf',
  variable: '--font-equip-extended',
  display: 'swap',
})

export const metadata = {
  title: 'URL Shortener - Fast & Scalable',
  description: 'Production-ready URL shortener with analytics and caching',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${equipExtended.variable}`}>
      <body>
        <SessionProvider>
          <ToastProvider>
            <DashboardLayout>
              {children}
            </DashboardLayout>
            <Toaster />
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
