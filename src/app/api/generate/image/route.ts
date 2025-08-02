import { NextRequest, NextResponse } from 'next/server'
// 一時的にNextAuthを無効化
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { 
  generateImageWithDALLE, 
  generateImageWithStability, 
  generateMockImage 
} from '@/lib/ai-providers'

export async function POST(request: NextRequest) {
  try {
    // 一時的に認証をスキップ
    // const session = await getServerSession(authOptions)
    
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // ダミーユーザーIDを使用
    const userId = 'temp-user-id'

    const { prompt, provider = 'mock' } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // 一時的にユーザーチェックを無効化してモック応答を返す
    try {
      // AI画像生成（モックのみ）
      const result = await generateMockImage({ prompt })

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        data: {
          id: 'temp-generation-id',
          url: result.data?.url,
          prompt,
          createdAt: new Date().toISOString()
        },
        usage: {
          used: 1,
          limit: 2,
          plan: 'free'
        }
      })

    } catch (error) {
      console.error('Mock image generation error:', error)
      return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
    }

  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 動的ルート設定
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'