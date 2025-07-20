// データベーススキーマをデプロイするスクリプト
// 本番環境のDATABASE_URLを.env.localに設定してから実行

const { execSync } = require('child_process');

console.log('🚀 Deploying database schema...');

try {
  // Prismaクライアントを生成
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // データベーススキーマを適用
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('✅ Database schema deployed successfully!');
} catch (error) {
  console.error('❌ Failed to deploy database schema:', error.message);
  process.exit(1);
}