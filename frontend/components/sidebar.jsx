"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Link2, BarChart3, Settings, LogOut, PlusCircle } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Button } from './ui/button'

const navItems = [
    {
        title: 'Shorten Link',
        href: '/dashboard/create',
        icon: PlusCircle,
    },
    {
        title: 'My Links',
        href: '/dashboard',
        icon: Link2,
    },
    {
        title: 'Analytics',
        href: '/dashboard/analytics',
        icon: BarChart3,
    },
    {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
    },
]

export function Sidebar({ user }) {
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-64 flex-col bg-white/5 backdrop-blur-xl border-r border-white/5">
            {/* Logo/Brand */}
            <div className="p-6 pb-2">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        <Link2 className="w-4 h-4 text-black" />
                    </div>
                    <h1 className="text-lg font-heading font-bold text-white tracking-wide">
                        URLShort
                    </h1>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4 mt-4">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 border",
                                isActive
                                    ? "bg-white/5 backdrop-blur-md text-white border-white/5 shadow-sm"
                                    : "text-text-secondary border-transparent hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    )
                })}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                        {user?.name?.[0] || user?.email?.[0] || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-[10px] text-text-muted truncate">
                            {user?.email}
                        </p>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
                        title="Sign Out"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
