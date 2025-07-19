'use client'

import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Sparkles, 
  Image, 
  Video, 
  Plus, 
  Settings, 
  CreditCard,
  LogOut,
  Users,
  Zap
} from "lucide-react"

interface Usage {
  image: { used: number; limit: number | null; remaining: number | null }
  video: { used: number; limit: number | null; remaining: number | null }
}

interface Generation {
  id: string
  type: 'image' | 'video'
  prompt: string
  status: string
  result?: string
  createdAt: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [usage, setUsage] = useState<Usage | null>(null)
  const [generations, setGenerations] = useState<Generation[]>([])
  const [plan, setPlan] = useState<string>('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchUsageData()
    }
  }, [session])

  const fetchUsageData = async () => {
    try {
      const response = await fetch('/api/usage')
      const data = await response.json()
      
      if (data.success) {
        setUsage(data.data.usage)
        setGenerations(data.data.generations)
        setPlan(data.data.plan)
      }
    } catch (error) {
      console.error('Failed to fetch usage data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'premium' }),
      })
      
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error)
    }
  }

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })
      
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Failed to create portal session:', error)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const isPremium = plan === 'premium'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">AI Creative Studio</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{session.user?.name}</span>
              </div>
              
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">ログアウト</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* プランステータス */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {isPremium ? 'プレミアムプラン' : '無料プラン'}
              </h2>
              <p className="text-gray-600">
                {isPremium 
                  ? 'AI画像・動画生成が無制限に利用できます' 
                  : '月の制限内でAI生成をお試しいただけます'
                }
              </p>
            </div>
            
            <div className="flex space-x-3">
              {!isPremium ? (
                <button
                  onClick={handleUpgrade}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 flex items-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>プレミアムにアップグレード</span>
                </button>
              ) : (
                <button
                  onClick={handleManageBilling}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center space-x-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>請求情報の管理</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 使用状況 */}
        {usage && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Image className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI画像生成</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">今月の使用量</span>
                  <span className="font-medium">
                    {usage.image.used}/{usage.image.limit || '無制限'}
                  </span>
                </div>
                
                {usage.image.limit && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(usage.image.used / usage.image.limit) * 100}%` }}
                    ></div>
                  </div>
                )}
                
                {usage.image.remaining !== null && (
                  <p className="text-xs text-gray-500">
                    残り {usage.image.remaining} 枚
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Video className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI動画生成</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">今月の使用量</span>
                  <span className="font-medium">
                    {usage.video.used}/{usage.video.limit || '無制限'}
                  </span>
                </div>
                
                {usage.video.limit && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(usage.video.used / usage.video.limit) * 100}%` }}
                    ></div>
                  </div>
                )}
                
                {usage.video.remaining !== null && (
                  <p className="text-xs text-gray-500">
                    残り {usage.video.remaining} 本
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 新規作成ボタン */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => router.push('/generate/image')}
            className="bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition-shadow border-2 border-dashed border-gray-200 hover:border-blue-300"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI画像生成</h3>
              <p className="text-gray-600">テキストから高品質な画像を生成</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/generate/video')}
            className="bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition-shadow border-2 border-dashed border-gray-200 hover:border-green-300"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI動画生成</h3>
              <p className="text-gray-600">テキストから動画を生成</p>
            </div>
          </button>
        </div>

        {/* 最近の生成履歴 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近の生成履歴</h3>
          
          {generations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">まだ生成された作品がありません</p>
              <p className="text-sm text-gray-500 mt-1">
                上のボタンから AI 生成を始めてみましょう
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generations.slice(0, 6).map((generation) => (
                <div key={generation.id} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    {generation.type === 'image' ? (
                      <Image className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Video className="w-4 h-4 text-green-600" />
                    )}
                    <span className="text-sm font-medium capitalize">
                      {generation.type === 'image' ? '画像' : '動画'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      generation.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : generation.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {generation.status === 'completed' ? '完了' : 
                       generation.status === 'pending' ? '処理中' : '失敗'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 truncate">
                    {generation.prompt}
                  </p>
                  
                  {generation.result && generation.status === 'completed' && (
                    <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                      {generation.type === 'image' ? (
                        <img
                          src={generation.result}
                          alt={generation.prompt}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={generation.result}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          autoPlay
                        />
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(generation.createdAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}