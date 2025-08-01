'use client'

// 一時的にNextAuthを無効化
// import { SessionProvider } from "next-auth/react"

export function Providers({ children }: { children: React.ReactNode }) {
  // return <SessionProvider>{children}</SessionProvider>
  return <>{children}</>
}