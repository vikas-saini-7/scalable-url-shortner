"use client"

import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Link as LinkIcon, Copy, Github, Zap, BarChart, Shield, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { data: session } = useSession()
  const router = useRouter()
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

  // If authenticated, redirect to dashboard
  if (session) {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      {/* Glassmorphism Header */}
      <header className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-heading font-bold text-white">URLShort</span>
          </div>
          <Button 
            onClick={() => signIn('github')}
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10 text-white"
          >
            <Github className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/5">
            <span className="text-sm text-primary font-medium">Production-Ready URL Shortener</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-heading font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Shorten URLs,
            <br />
            Track Analytics
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Fast, scalable, and production-ready URL shortening service with real-time analytics 
            and Redis caching
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => signIn('github')}
              className="bg-white text-black hover:bg-gray-200"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 text-white"
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          <div className="group p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 hover:bg-white/10 transition-all">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2 text-white">Lightning Fast</h3>
            <p className="text-text-secondary">
              Redis caching ensures instant redirects with sub-millisecond response times
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 hover:bg-white/10 transition-all">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2 text-white">Real-time Analytics</h3>
            <p className="text-text-secondary">
              Track clicks, monitor performance, and gain insights into your shortened URLs
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 hover:bg-white/10 transition-all">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2 text-white">Secure & Reliable</h3>
            <p className="text-text-secondary">
              GitHub OAuth authentication with rate limiting and production-grade security
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-text-muted mb-4">Built with modern technologies</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Next.js', 'Express', 'PostgreSQL', 'Redis', 'Docker'].map((tech) => (
              <span 
                key={tech}
                className="px-4 py-2 rounded-lg bg-white/5 backdrop-blur-md border border-white/5 text-sm text-text-secondary"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 backdrop-blur-xl bg-white/5">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-text-muted">
            Built with ❤️ for production use
          </p>
        </div>
      </footer>
    </div>
  )
}
