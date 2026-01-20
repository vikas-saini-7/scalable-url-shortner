"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Link as LinkIcon, Copy, Plus } from 'lucide-react'

export default function CreateUrlPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [longUrl, setLongUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleShorten = async (e) => {
    e.preventDefault()
    
    setLoading(true)
    
    try {
      const response = await fetch('http://localhost:5000/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': session?.user?.id,
          'x-user-email': session?.user?.email,
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Create New URL
        </h1>
        <p className="text-text-secondary">
          Shorten a long URL to share it easily
        </p>
      </div>

      <div className="w-full">
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Plus className="w-5 h-5 text-white" />
              <h2 className="text-xl font-heading font-semibold text-white">Shorten URL</h2>
            </div>
            <p className="text-sm text-text-secondary">
              Paste your long URL below to generate a short link
            </p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleShorten} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="url"
                  placeholder="https://example.com/very/long/url"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  required
                  className="text-base bg-black/20 border-white/5 text-white placeholder:text-text-muted focus:border-white/10 focus:ring-white/5"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-white text-black hover:bg-gray-200" 
                disabled={loading}
              >
                {loading ? 'Shortening...' : 'Shorten URL'}
              </Button>
            </form>

            {shortUrl && (
              <div className="mt-6 p-4 bg-black/20 rounded-xl border border-white/5">
                <label className="text-sm text-text-secondary mb-2 block">
                  Your shortened URL:
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={shortUrl}
                    readOnly
                    className="font-mono bg-transparent border-white/5 text-white"
                  />
                  <Button onClick={handleCopy} variant="secondary" size="icon" className="bg-white/10 hover:bg-white/20 text-white border border-white/5">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
