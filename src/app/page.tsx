import Link from 'next/link'
import { CreditCard, Image, Video, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">AI Creative Studio</span>
            </div>
            <nav className="flex space-x-8">
              <Link href="#features" className="text-gray-500 hover:text-gray-900">機能</Link>
              <Link href="#pricing" className="text-gray-500 hover:text-gray-900">プラン</Link>
              <Link href="/auth/signin" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">ログイン</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI画像・動画生成で<br />
            <span className="text-purple-600">創造性を解き放つ</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            最新のAI技術を使って、プロ品質の画像や動画を簡単に生成。無料で始めて、より多くの作品を有料プランで作成できます。
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/signup" className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700">
              無料で始める
            </Link>
            <Link href="#demo" className="border border-purple-600 text-purple-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-50">
              デモを見る
            </Link>
          </div>
        </div>
      </section>

      {/* 機能セクション */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">強力なAI生成機能</h2>
            <p className="text-lg text-gray-600">プロ品質のコンテンツを数秒で生成</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Image className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI画像生成</h3>
                <p className="text-gray-600 mb-4">
                  テキストから高品質な画像を生成。アート、写真、イラスト、ロゴなど様々なスタイルに対応。
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• 無料プラン: 月2枚まで</li>
                  <li>• 有料プラン: 無制限生成</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Video className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI動画生成</h3>
                <p className="text-gray-600 mb-4">
                  テキストや画像から動画を生成。プロモーション動画、アニメーション、エフェクトを簡単作成。
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• 無料プラン: 月1本まで</li>
                  <li>• 有料プラン: 無制限生成</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* プランセクション */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">シンプルな料金プラン</h2>
            <p className="text-lg text-gray-600">まずは無料で始めて、必要に応じてアップグレード</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 無料プラン */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">無料プラン</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">¥0</span>
                  <span className="text-gray-600 ml-2">/月</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <div className="bg-green-100 rounded-full p-1 mr-3">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">AI画像生成 月2枚まで</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-green-100 rounded-full p-1 mr-3">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">AI動画生成 月1本まで</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-green-100 rounded-full p-1 mr-3">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">基本テンプレート</span>
                </li>
              </ul>
              
              <Link href="/auth/signup" className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 text-center block">
                無料で始める
              </Link>
            </div>

            {/* プレミアムプラン */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-lg p-8 text-white relative">
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                人気
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">プレミアムプラン</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">¥2,980</span>
                  <span className="ml-2 opacity-90">/月</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <div className="bg-white rounded-full p-1 mr-3">
                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>AI画像生成 無制限</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-white rounded-full p-1 mr-3">
                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>AI動画生成 無制限</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-white rounded-full p-1 mr-3">
                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>プレミアムテンプレート</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-white rounded-full p-1 mr-3">
                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>優先サポート</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-white rounded-full p-1 mr-3">
                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>高解像度出力</span>
                </li>
              </ul>
              
              <Link href="/auth/signup?plan=premium" className="w-full bg-white text-purple-600 py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 text-center block">
                プレミアムを始める
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Sparkles className="h-6 w-6 text-purple-500" />
                <span className="ml-2 text-lg font-bold">AI Creative Studio</span>
              </div>
              <p className="text-gray-400">
                AI技術で創造性を解き放つプラットフォーム
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">製品</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">AI画像生成</Link></li>
                <li><Link href="#" className="hover:text-white">AI動画生成</Link></li>
                <li><Link href="#" className="hover:text-white">テンプレート</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">サポート</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">ヘルプセンター</Link></li>
                <li><Link href="#" className="hover:text-white">お問い合わせ</Link></li>
                <li><Link href="#" className="hover:text-white">利用規約</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">会社</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">私たちについて</Link></li>
                <li><Link href="#" className="hover:text-white">ブログ</Link></li>
                <li><Link href="#" className="hover:text-white">プライバシーポリシー</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 AI Creative Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}