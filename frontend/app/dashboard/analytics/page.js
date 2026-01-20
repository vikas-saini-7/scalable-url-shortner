"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BarChart3, TrendingUp, Activity, Globe } from 'lucide-react'

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [urls, setUrls] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchUrls()
    }
  }, [status, router])

  const fetchUrls = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stats', {
        headers: {
          'x-user-id': session.user.id,
          'x-user-email': session.user.email,
        },
      })

      const data = await response.json()
      if (data.success) {
        setUrls(data.data.urls)
      }
    } catch (error) {
      console.error('Failed to fetch URLs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  const totalClicks = urls.reduce((sum, url) => sum + url.clickCount, 0)
  const avgClicksPerUrl = urls.length > 0 ? Math.round(totalClicks / urls.length) : 0
  const topPerformer = urls.reduce((max, url) => url.clickCount > (max?.clickCount || 0) ? url : max, null)

  return (
    <div className="p-8">
      <div className="mb-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Analytics
          </h1>
          <p className="text-text-secondary">
            Detailed insights into your URL performance
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 hover:bg-white/10 transition-all">
            <div className="flex items-center gap-2 mb-3 text-text-muted">
              <Activity className="h-4 w-4" />
              <span className="text-sm">Total Clicks</span>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{totalClicks}</div>
            <p className="text-xs text-text-muted">All-time performance</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 hover:bg-white/10 transition-all">
            <div className="flex items-center gap-2 mb-3 text-text-muted">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Avg. Click Rate</span>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{avgClicksPerUrl}</div>
            <p className="text-xs text-text-muted">Clicks per URL</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 hover:bg-white/10 transition-all">
            <div className="flex items-center gap-2 mb-3 text-text-muted">
              <Globe className="h-4 w-4" />
              <span className="text-sm">Total URLs</span>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{urls.length}</div>
            <p className="text-xs text-text-muted">URLs created</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 hover:bg-white/10 transition-all">
            <div className="flex items-center gap-2 mb-3 text-text-muted">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm">Top Performer</span>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{topPerformer?.clickCount || 0}</div>
            <p className="text-xs text-text-muted truncate">
              {topPerformer ? `/${topPerformer.shortCode}` : 'No data'}
            </p>
          </div>
        </div>

        {/* Top URLs */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-xl font-heading font-semibold text-white mb-2">
              Top Performing URLs
            </h2>
            <p className="text-sm text-text-secondary">
              Your most clicked URLs
            </p>
          </div>
          
          <div className="p-6">
            {urls.length === 0 ? (
              <div className="text-center py-12 text-text-muted">
                No data available yet
              </div>
            ) : (
              <div className="space-y-4">
                {urls
                  .sort((a, b) => b.clickCount - a.clickCount)
                  .slice(0, 5)
                  .map((url, index) => (
                    <div key={url.shortCode} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center text-white font-bold border border-white/10">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-white font-semibold">
                            /{url.shortCode}
                          </p>
                          <p className="text-sm text-text-muted truncate">
                            {url.longUrl}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className="text-3xl font-bold text-white">
                          {url.clickCount}
                        </span>
                        <span className="text-sm text-text-muted ml-1">clicks</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
