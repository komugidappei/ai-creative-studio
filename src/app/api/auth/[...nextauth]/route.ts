// 最小限のNextAuth APIルート（ビルドエラー回避用）
export async function GET(request: Request) {
  return new Response('NextAuth API - Build placeholder', { 
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  })
}

export async function POST(request: Request) {
  return new Response('NextAuth API - Build placeholder', { 
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  })
}

// 動的ルート設定
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'