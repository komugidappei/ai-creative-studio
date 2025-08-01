/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // キャッシュクリア用
  env: {
    CACHE_BUST: Date.now().toString(),
  },
}

module.exports = nextConfig