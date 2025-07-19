'use client'

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Sparkles, Check } from "lucide-react"

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      const callbackUrl = plan === 'premium' ? '/dashboard?upgrade=true' : '/dashboard'
      const result = await signIn('google', { 
        callbackUrl,
        redirect: false 
      })
      
      if (result?.ok) {
        router.push(callbackUrl)
      }
    } catch (error) {
      console.error('サインアップエラー:', error)
    }
    setIsLoading(false)
  }

  const selectedPlan = plan === 'premium' ? 'premium' : 'free'
  const planDetails = {
    free: {
      name: '無料プラン',
      price: '¥0/月',
      features: [
        'AI画像生成 月2枚まで',
        'AI動画生成 月1本まで',
        '基本テンプレート',
        'コミュニティサポート'
      ]
    },
    premium: {
      name: 'プレミアムプラン', 
      price: '¥2,980/月',
      features: [
        'AI画像生成 無制限',
        'AI動画生成 無制限',
        'プレミアムテンプレート',
        '優先サポート',
        '高解像度出力',
        '商用利用可能'
      ]
    }
  }

  const currentPlan = planDetails[selectedPlan]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center mb-6">
            <Sparkles className="h-12 w-12 text-purple-600" />
            <span className="ml-2 text-3xl font-bold text-gray-900">AI Creative Studio</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">アカウントを作成</h2>
          <p className="text-gray-600">AI画像・動画生成を始めましょう</p>
        </div>

        {/* プラン表示 */}
        <div className={`bg-white rounded-lg shadow-lg p-6 ${selectedPlan === 'premium' ? 'border-2 border-purple-500' : ''}`}>
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">{currentPlan.name}</h3>
            <p className="text-2xl font-bold text-purple-600 mt-2">{currentPlan.price}</p>
          </div>
          
          <ul className="space-y-3 mb-6">
            {currentPlan.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          
          <button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Googleで{currentPlan.name}を始める
              </>
            )}
          </button>
        </div>

        {/* プラン切り替え */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">
            他のプランをお探しですか？
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/auth/signup" 
              className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedPlan === 'free' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
              無料プラン
            </Link>
            <Link 
              href="/auth/signup?plan=premium" 
              className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedPlan === 'premium' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
              プレミアムプラン
            </Link>
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            すでにアカウントをお持ちの方は{' '}
            <Link href="/auth/signin" className="text-purple-600 hover:text-purple-500 font-medium">
              こちらからログイン
            </Link>
          </p>
          <Link href="/" className="block text-purple-600 hover:text-purple-500 font-medium">
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}