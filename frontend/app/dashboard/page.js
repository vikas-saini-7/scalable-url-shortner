"use client"

import { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LogOut, BarChart3, ExternalLink, Clock } from 'lucide-react'

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-default py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-heading font-semibold text-text-primary">
            URL Shortener
          </h1>
          <div className="flex gap-4 items-center">
            <a href="/" className="text-text-secondary hover:text-text-primary transition-colors">
              Home
            </a>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold mb-2">Dashboard</h2>
          <p className="text-text-secondary">
            Welcome back, {session?.user?.name || session?.user?.email}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total URLs</CardDescription>
              <CardTitle className="text-3xl">{urls.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Clicks</CardDescription>
              <CardTitle className="text-3xl">
                {urls.reduce((sum, url) => sum + url.clickCount, 0)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active URLs</CardDescription>
              <CardTitle className="text-3xl">
                {urls.filter(url => !url.isExpired).length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* URLs Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Your URLs
            </CardTitle>
            <CardDescription>
              All your shortened URLs with analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {urls.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-muted mb-4">No URLs yet</p>
                <Button onClick={() => router.push('/')}>
                  Create your first URL
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Short Code</TableHead>
                      <TableHead className="hidden md:table-cell">Original URL</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead className="hidden lg:table-cell">Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {urls.map((url) => (
                      <TableRow key={url.shortCode}>
                        <TableCell className="font-mono text-secondary">
                          {url.shortCode}
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate">
                          {url.longUrl}
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">{url.clickCount}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-text-muted">
                          {formatDate(url.createdAt)}
                        </TableCell>
                        <TableCell>
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
                            <span className="text-sm text-secondary">Active</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <a
                            href={url.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:text-primary-hover transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-default py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-text-muted text-sm">
          Built with Next.js, Express, PostgreSQL, and Redis
        </div>
      </footer>
    </div>
  )
}
