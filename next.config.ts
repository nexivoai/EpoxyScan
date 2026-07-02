import type { NextConfig } from 'next'

const SENSITIVE_HEADERS = [
  { key: 'Cache-Control', value: 'no-store, max-age=0' },
  { key: 'Referrer-Policy', value: 'no-referrer' },
  { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
]

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  async headers() {
    return [
      { source: '/review/:token*', headers: SENSITIVE_HEADERS },
      { source: '/result/:token*', headers: SENSITIVE_HEADERS },
    ]
  },
}

export default nextConfig
