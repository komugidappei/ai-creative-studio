'use client'

import { useSession } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Video, Download, Share2 } from "lucide-react"
import Link from "next/link"

interface GenerationResult {
  success: boolean
  data?: {
    id: string
    url: string
    prompt: string
    createdAt: string
  }
  usage?: {
    used: number
    limit: number | null
    plan: string
  }
  error?: string
}

export default function VideoGeneration() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<GenerationResult | null>(null)

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: prompt.trim(),
          provider: 'mock' // 開発用はmock、本番ではreplicateを使用
        }),
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        // 成功時の処理
      } else {
        // エラー処理
        console.error('Generation failed:', data.error)
      }
    } catch (error) {
      console.error('Generation error:', error)
      setResult({
        success: false,
        error: 'ネットワークエラーが発生しました'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!result?.data?.url) return

    try {
      const response = await fetch(result.data.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `ai-generated-video-${result.data.id}.mp4`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleShare = async () => {
    if (navigator.share && result?.data?.url) {
      try {
        await navigator.share({
          title: 'AI Generated Video',
          text: result.data.prompt,
          url: result.data.url,
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span>ダッシュボードに戻る</span>
            </Link>
            <div className="flex items-center">
              <Video className="h-6 w-6 text-green-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">AI動画生成</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 入力セクション */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">動画の説明を入力</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                    プロンプト
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="例: 波が静かに打ち寄せる美しいビーチ、ゆっくりとした動き、夕方の光"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    rows={4}
                    disabled={isGenerating}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    動きや時間の流れを含めた詳細な説明をすると、より良い結果が得られます
                  </p>
                </div>
                
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>生成中...</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-5 h-5" />
                      <span>動画を生成</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 使用状況表示 */}
            {result?.usage && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">今月の使用状況</h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>使用量</span>
                  <span>
                    {result.usage.used}/{result.usage.limit || '無制限'} 
                    ({result.usage.plan === 'premium' ? 'プレミアム' : '無料'}プラン)
                  </span>
                </div>
                {result.usage.limit && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(result.usage.used / result.usage.limit) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            )}

            {/* 注意事項 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">動画生成について</h3>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• 動画生成には数分かかる場合があります</li>
                <li>• 生成される動画は短時間（数秒〜十数秒）です</li>
                <li>• 複雑なシーンほど生成に時間がかかります</li>
              </ul>
            </div>
          </div>

          {/* 結果セクション */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">生成結果</h2>
              
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">AI動画を生成中...</p>
                    <p className="text-xs text-gray-500 mt-1">これには数分かかる場合があります</p>
                  </div>
                ) : result?.success && result.data ? (
                  <video
                    src={result.data.url}
                    controls
                    className="w-full h-full rounded-lg"
                    poster="/video-placeholder.jpg"
                  >
                    お使いのブラウザは動画再生に対応していません。
                  </video>
                ) : result?.error ? (
                  <div className="text-center text-red-600">
                    <p className="font-medium">エラーが発生しました</p>
                    <p className="text-sm mt-1">{result.error}</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>プロンプトを入力して動画を生成してください</p>
                  </div>
                )}
              </div>

              {/* アクションボタン */}
              {result?.success && result.data && (
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>ダウンロード</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>共有</span>
                  </button>
                </div>
              )}
            </div>

            {/* 生成された動画の詳細 */}
            {result?.success && result.data && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">動画詳細</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">プロンプト:</span>
                    <p className="mt-1">{result.data.prompt}</p>
                  </div>
                  <div>
                    <span className="font-medium">生成日時:</span>
                    <span className="ml-2">
                      {new Date(result.data.createdAt).toLocaleString('ja-JP')}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">ID:</span>
                    <span className="ml-2 font-mono text-xs">{result.data.id}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}