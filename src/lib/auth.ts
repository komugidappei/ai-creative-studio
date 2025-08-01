// 一時的にNextAuthを完全に無効化
/*
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"

// ビルド時かどうかを判定
const isBuildTime = typeof window === 'undefined' && process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL

// ビルド時はPrismaを初期化しない
let prisma: any = null
if (!isBuildTime) {
  try {
    const { prisma: prismaClient } = require("./prisma")
    prisma = prismaClient
  } catch (error) {
    console.log('Prisma not available during build')
  }
}

export const authOptions: NextAuthOptions = {
  // ビルド時はアダプターを無効化
  ...(prisma && !isBuildTime ? { adapter: PrismaAdapter(prisma) } : {}),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user && prisma) {
        session.user.id = user.id
        
        try {
          // ユーザーのサブスクリプション情報を取得
          const subscription = await prisma.subscription.findUnique({
            where: { userId: user.id }
          })
          
          session.user.subscription = subscription || undefined
        } catch (error) {
          console.error('Session callback error:', error)
        }
      }
      return session
    },
    async signIn({ user, account }) {
      // ビルド時またはPrismaが利用できない場合はスキップ
      if (!prisma || isBuildTime) return true
      
      // 新規ユーザーの場合、無料プランのサブスクリプションを作成
      if (account?.provider === "google" && user.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          })
          
          if (!existingUser) {
            // 新規ユーザーの場合、無料プランを設定
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || null,
                image: user.image || null,
                subscription: {
                  create: {
                    plan: "free",
                    status: "active"
                  }
                }
              }
            })
          }
        } catch (error) {
          console.error('SignIn error:', error)
          return false
        }
      }
      return true
    }
  },
  pages: {
    signIn: "/auth/signin"
  }
}
*/

// 一時的なダミー設定
export const authOptions = {}