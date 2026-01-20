"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { User, Mail, Calendar, Settings as SettingsIcon } from 'lucide-react'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  const createdDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-text-secondary">
            Manage your account preferences
          </p>
        </div>

        {/* Profile Section */}
        <div className="w-full">
          <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 overflow-hidden mb-6">
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <SettingsIcon className="h-5 w-5 text-white" />
                <h2 className="text-xl font-heading font-semibold text-white">Profile Information</h2>
              </div>
              <p className="text-sm text-text-secondary">
                Your account details from GitHub
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-white to-gray-300 flex items-center justify-center text-black text-2xl font-bold">
                  {session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">
                    {session?.user?.name || 'User'}
                  </p>
                  <p className="text-sm text-text-muted">
                    GitHub Account
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <User className="h-5 w-5 text-text-secondary mt-0.5" />
                  <div>
                    <p className="text-sm text-text-muted">Name</p>
                    <p className="text-white font-medium">
                      {session?.user?.name || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <Mail className="h-5 w-5 text-text-secondary mt-0.5" />
                  <div>
                    <p className="text-sm text-text-muted">Email</p>
                    <p className="text-white font-medium">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <Calendar className="h-5 w-5 text-text-secondary mt-0.5" />
                  <div>
                    <p className="text-sm text-text-muted">Member Since</p>
                    <p className="text-white font-medium">
                      {createdDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Settings Card */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-heading font-semibold text-white mb-2">Preferences</h2>
              <p className="text-sm text-text-secondary">
                App configuration and preferences
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <p className="font-medium text-white">Theme</p>
                    <p className="text-sm text-text-muted">Dark (Default)</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <p className="font-medium text-white">Authentication</p>
                    <p className="text-sm text-text-muted">GitHub OAuth</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <p className="font-medium text-white">API Access</p>
                    <p className="text-sm text-text-muted">Enabled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
