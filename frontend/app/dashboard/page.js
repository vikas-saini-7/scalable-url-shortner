"use client"

import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChart3, ExternalLink, Clock, TrendingUp, Link2, MousePointerClick } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  const totalClicks = urls.reduce((sum, url) => sum + url.clickCount, 0)
  const activeUrls = urls.filter(url => !url.isExpired).length

  return (
    <div className="p-8">
      <div className="mb-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            My URLs
          </h1>
          <p className="text-text-secondary">
            Manage and track all your shortened URLs
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="group p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 hover:bg-white/10 transition-all">
            <div className="flex items-center gap-2 mb-3 text-text-muted">
              <Link2 className="h-4 w-4" />
              <span className="text-sm">Total URLs</span>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{urls.length}</div>
            <p className="text-xs text-text-muted">
              {activeUrls} active, {urls.length - activeUrls} expired
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 hover:bg-white/10 transition-all">
            <div className="flex items-center gap-2 mb-3 text-text-muted">
              <MousePointerClick className="h-4 w-4" />
              <span className="text-sm">Total Clicks</span>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{totalClicks}</div>
            <p className="text-xs text-text-muted">
              Across all URLs
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 hover:bg-white/10 transition-all">
            <div className="flex items-center gap-2 mb-3 text-text-muted">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Avg. Clicks/URL</span>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {urls.length > 0 ? Math.round(totalClicks / urls.length) : 0}
            </div>
            <p className="text-xs text-text-muted">
              Performance metric
            </p>
          </div>
        </div>

        {/* URLs Table */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-white" />
              <h2 className="text-xl font-heading font-semibold text-white">URL Analytics</h2>
            </div>
            <p className="text-sm text-text-secondary">
              Detailed view of all your shortened URLs
            </p>
          </div>
          
          <div className="p-6">
            {urls.length === 0 ? (
              <div className="text-center py-12">
                <Link2 className="h-12 w-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-muted mb-4">No URLs yet</p>
                <Button 
                  onClick={() => router.push('/')}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  Create your first URL
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Short Code</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted hidden md:table-cell">Original URL</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Clicks</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted hidden lg:table-cell">Created</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {urls.map((url) => (
                      <tr key={url.shortCode} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-mono text-white font-semibold">
                          {url.shortCode}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell max-w-xs truncate">
                          <a 
                            href={url.longUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-text-secondary hover:text-white transition-colors"
                          >
                            {url.longUrl}
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-white">{url.clickCount}</span>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell text-text-muted text-sm">
                          {formatDate(url.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          {url.isExpired ? (
                            <span className="inline-flex items-center gap-1 text-sm text-red-400">
                              <Clock className="w-3 h-3" />
                              Expired
                            </span>
                          ) : url.expiresAt ? (
                            <span className="text-sm text-text-muted">
                              Expires {formatDate(url.expiresAt)}
                            </span>
                          ) : (
                            <span className="text-sm text-white font-medium">Active</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <a
                            href={url.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-white hover:text-gray-300 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
