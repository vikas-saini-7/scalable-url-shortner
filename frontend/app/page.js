"use client"

import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Link as LinkIcon, Copy, LogIn, LogOut } from 'lucide-react'

export default function HomePage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [longUrl, setLongUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleShorten = async (e) => {
    e.preventDefault()
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to shorten URLs",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('http://localhost:5000/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': session.user.id,
          'x-user-email': session.user.email,
        },
        body: JSON.stringify({ longUrl }),
      })

      const data = await response.json()

      if (data.success) {
        setShortUrl(data.data.shortUrl)
        toast({
          title: "Success!",
          description: "URL shortened successfully"
        })
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to shorten URL",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
    toast({
      title: "Copied!",
      description: "Short URL copied to clipboard"
    })
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
            {session ? (
              <>
                <a href="/dashboard" className="text-text-secondary hover:text-text-primary transition-colors">
                  Dashboard
                </a>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" onClick={() => signIn('github')}>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In with GitHub
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Shorten Your URLs
            </h2>
            <p className="text-text-secondary text-lg">
              Fast, scalable, and production-ready URL shortening service
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Create Short URL
              </CardTitle>
              <CardDescription>
                Enter a long URL to generate a short, shareable link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleShorten} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/very/long/url"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    required
                    className="text-base"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !session}
                >
                  {loading ? 'Shortening...' : 'Shorten URL'}
                </Button>

                {!session && (
                  <p className="text-sm text-text-muted text-center">
                    Sign in with GitHub to start shortening URLs
                  </p>
                )}
              </form>

              {shortUrl && (
                <div className="mt-6 p-4 bg-bg-base rounded-md border border-default">
                  <label className="text-sm text-text-secondary mb-2 block">
                    Your shortened URL:
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={shortUrl}
                      readOnly
                      className="font-mono"
                    />
                    <Button onClick={handleCopy} variant="secondary" size="icon">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mt-12">
            <div className="text-center">
              <div className="text-secondary text-3xl font-bold mb-2">⚡</div>
              <h3 className="font-semibold mb-1">Lightning Fast</h3>
              <p className="text-sm text-text-muted">Redis caching for instant redirects</p>
            </div>
            <div className="text-center">
              <div className="text-secondary text-3xl font-bold mb-2">📊</div>
              <h3 className="font-semibold mb-1">Analytics</h3>
              <p className="text-sm text-text-muted">Track clicks and performance</p>
            </div>
            <div className="text-center">
              <div className="text-secondary text-3xl font-bold mb-2">🔒</div>
              <h3 className="font-semibold mb-1">Secure</h3>
              <p className="text-sm text-text-muted">Authenticated and rate-limited</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-default py-6">
        <div className="container mx-auto px-4 text-center text-text-muted text-sm">
          Built with Next.js, Express, PostgreSQL, and Redis
        </div>
      </footer>
    </div>
  )
}
