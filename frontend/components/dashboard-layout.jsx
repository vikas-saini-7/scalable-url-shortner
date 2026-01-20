"use client"

import { useSession } from 'next-auth/react'
import { Sidebar } from './sidebar'

export function DashboardLayout({ children }) {
    const { data: session, status } = useSession()

    // Show loader while checking authentication
    if (status === 'loading') {
        return (
            <div className="flex h-screen items-center justify-center bg-bg-base">
                <div className="text-text-secondary">Loading...</div>
            </div>
        )
    }

    // If not authenticated, show children without sidebar
    if (!session) {
        return children
    }

    // If authenticated, show sidebar + children
    return (
        <div className="flex h-screen overflow-hidden relative bg-black">
            {/* Global Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-0" />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 flex w-full h-full">
                <Sidebar user={session.user} />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
