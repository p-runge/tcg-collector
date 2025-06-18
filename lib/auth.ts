import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { sql } from "./db"
import type { DefaultSession } from "next-auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "discord" && profile) {
        try {
          // Check if user exists
          const existingUser = await sql`
            SELECT id FROM users WHERE discord_id = ${profile.id}
          `

          if (existingUser.length === 0) {
            // Create new user
            await sql`
              INSERT INTO users (discord_id, username, avatar_url)
              VALUES (${profile.id}, ${profile.username || user.name}, ${user.image})
            `
          } else {
            // Update existing user
            await sql`
              UPDATE users 
              SET username = ${profile.username || user.name}, avatar_url = ${user.image}
              WHERE discord_id = ${profile.id}
            `
          }
        } catch (error) {
          console.error("Error saving user to database:", error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user && token.discord_id) {
        try {
          const user = await sql`
            SELECT * FROM users WHERE discord_id = ${token.discord_id}
          `
          if (user.length > 0) {
            session.user.id = user[0].id
            session.user.discord_id = user[0].discord_id
            session.user.favorite_language_id = user[0].favorite_language_id
          }
        } catch (error) {
          console.error("Error fetching user from database:", error)
        }
      }
      return session
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.discord_id = profile.id
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
})

declare module "next-auth" {
  interface Session {
    user: {
      id: number
      discord_id: string
      favorite_language_id?: number
    } & DefaultSession["user"]
  }
}
