# AI Creative Studio

AI画像・動画生成のサブスクリプションサービス

## 機能

- **AI画像生成**: DALL-E、Stability AIを使用した高品質な画像生成
- **AI動画生成**: Replicateを使用した動画生成
- **フリーミアムモデル**: 無料プラン（制限あり）とプレミアムプラン（無制限）
- **ユーザー認証**: NextAuth.jsによるGoogle OAuth
- **サブスクリプション管理**: Stripeによる決済とサブスクリプション管理
- **使用量追跡**: 月次使用制限の管理

## 技術スタック

- **フロントエンド**: Next.js 14, TypeScript, Tailwind CSS
- **認証**: NextAuth.js
- **データベース**: Prisma + SQLite (開発), PostgreSQL (本番)
- **決済**: Stripe
- **AI API**: OpenAI DALL-E, Stability AI, Replicate
- **デプロイ**: Vercel推奨

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定:

```env
# データベース
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PREMIUM_PRICE_ID="price_..."

# AI APIs
OPENAI_API_KEY="sk-..."
STABILITY_API_KEY="sk-..."
REPLICATE_API_TOKEN="r8_..."
```

### 3. データベースのセットアップ

```bash
npx prisma db push
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

## プラン

### 無料プラン
- AI画像生成: 月2枚まで
- AI動画生成: 月1本まで
- 基本テンプレート

### プレミアムプラン (¥2,980/月)
- AI画像生成: 無制限
- AI動画生成: 無制限
- プレミアムテンプレート
- 優先サポート
- 高解像度出力

## API エンドポイント

- `POST /api/generate/image` - 画像生成
- `POST /api/generate/video` - 動画生成
- `GET /api/usage` - 使用状況取得
- `POST /api/stripe/checkout` - Stripe決済セッション作成
- `POST /api/stripe/portal` - Stripeポータルセッション作成
- `POST /api/stripe/webhook` - Stripeウェブフック

## フォルダ構造

```
src/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # 認証ページ
│   ├── dashboard/        # ダッシュボード
│   ├── generate/         # AI生成ページ
│   └── layout.tsx
├── lib/
│   ├── auth.ts          # NextAuth設定
│   ├── prisma.ts        # Prismaクライアント
│   ├── stripe.ts        # Stripe設定
│   └── ai-providers.ts  # AI API統合
└── components/          # 共通コンポーネント
```

## デプロイ

### Vercelでのデプロイ

1. GitHubリポジトリにプッシュ
2. Vercelでプロジェクトをインポート
3. 環境変数を設定
4. PostgreSQLデータベースをセットアップ（Supabase、PlanetScale等）
5. Stripeの本番APIキーに切り替え

### 環境変数（本番）

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.vercel.app"
# 他の環境変数も本番用に設定
```

## ライセンス

MIT License