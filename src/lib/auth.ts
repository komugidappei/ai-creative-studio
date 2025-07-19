import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        
        // ユーザーのサブスクリプション情報を取得
        const subscription = await prisma.subscription.findUnique({
          where: { userId: user.id }
        })
        
        session.user.subscription = subscription
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // 新規ユーザーの場合、無料プランのサブスクリプションを作成
      if (account?.provider === "google" && user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        })
        
        if (!existingUser) {
          // 新規ユーザーの場合、無料プランを設定
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              image: user.image,
              subscription: {
                create: {
                  plan: "free",
                  status: "active"
                }
              }
            }
          })
        }
      }
      return true
    }
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  session: {
    strategy: "database",
  },
}