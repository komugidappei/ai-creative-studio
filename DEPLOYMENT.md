# デプロイガイド

## 前提条件

以下のアカウントが必要です：
- [Vercel](https://vercel.com)（デプロイ用）
- [Supabase](https://supabase.com) または [PlanetScale](https://planetscale.com)（データベース用）
- [Stripe](https://stripe.com)（決済用）
- [Google Cloud Platform](https://console.cloud.google.com)（OAuth用）
- [OpenAI](https://platform.openai.com)（AI画像生成用）

## 1. データベース設定（Supabase）

1. Supabaseで新しいプロジェクトを作成
2. データベースURLをコピー
3. 本番用にPrismaスキーマを更新:
   ```bash
   npx prisma db push
   ```

## 2. Stripe設定

1. Stripeダッシュボードで製品を作成:
   - 名前: プレミアムプラン
   - 価格: ¥2,980/月（recurring）
   - 価格IDをコピー

2. ウェブフックエンドポイントを設定:
   - URL: `https://your-app.vercel.app/api/stripe/webhook`
   - イベント: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

## 3. Google OAuth設定

1. Google Cloud Consoleで新しいプロジェクトを作成
2. APIs & Services → 認証情報
3. OAuth 2.0クライアントIDを作成:
   - 承認済みのリダイレクトURI: `https://your-app.vercel.app/api/auth/callback/google`

## 4. AI API設定

### OpenAI
1. [OpenAI Platform](https://platform.openai.com)でAPIキーを取得
2. 請求情報を設定（DALL-E使用のため）

### Stability AI
1. [Stability AI](https://platform.stability.ai)でAPIキーを取得

### Replicate
1. [Replicate](https://replicate.com)でAPIトークンを取得

## 5. Vercelデプロイ

1. GitHubリポジトリをVercelにインポート
2. Framework Preset: Next.js
3. 環境変数を設定:

```env
# データベース
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"

# NextAuth
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="[ランダムな32文字以上の文字列]"

# Google OAuth
GOOGLE_CLIENT_ID="[Google Cloud Consoleから]"
GOOGLE_CLIENT_SECRET="[Google Cloud Consoleから]"

# Stripe
STRIPE_SECRET_KEY="sk_live_[本番環境のシークレットキー]"
STRIPE_PUBLISHABLE_KEY="pk_live_[本番環境のパブリックキー]"
STRIPE_WEBHOOK_SECRET="whsec_[ウェブフックのシークレット]"
STRIPE_PREMIUM_PRICE_ID="price_[プレミアムプランの価格ID]"

# AI APIs
OPENAI_API_KEY="sk-[OpenAIのAPIキー]"
STABILITY_API_KEY="sk-[Stability AIのAPIキー]"
REPLICATE_API_TOKEN="r8_[ReplicateのAPIトークン]"
```

## 6. デプロイ後の確認

1. ✅ サイトが正常に表示される
2. ✅ Google OAuth でログインできる
3. ✅ AI画像生成が動作する（開発用はmock、本番用は実際のAPI）
4. ✅ Stripe決済フローが動作する
5. ✅ 使用制限が正しく機能する

## 7. 本番運用の注意点

### セキュリティ
- すべてのAPIキーを適切に管理
- 本番環境でのみHTTPSを使用
- 定期的にキーをローテーション

### コスト管理
- AI APIの使用量を監視
- Stripeの手数料を考慮した価格設定
- Vercelの使用量を確認

### モニタリング
- Vercelのログを監視
- Stripeの決済状況を確認
- AI APIのレート制限に注意

## トラブルシューティング

### ビルドエラー
```bash
# 依存関係の確認
npm ci
npm run build

# Prismaクライアントの再生成
npx prisma generate
```

### 認証エラー
- Google OAuthのリダイレクトURIを確認
- NEXTAUTH_URLが正しく設定されているか確認

### 決済エラー
- Stripeのウェブフックエンドポイントが正しく設定されているか確認
- 本番環境のAPIキーを使用しているか確認

## カスタムドメイン（オプション）

1. Vercelプロジェクト設定でドメインを追加
2. DNS設定でCNAMEレコードを追加
3. Google OAuthとStripeの設定を新しいドメインに更新