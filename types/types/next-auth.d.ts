// types/next-auth.d.ts
import type { Session } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
    }
  }

  interface Profile {
    email: string
    name: string
    picture: string
  }
}