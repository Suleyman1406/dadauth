import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";

import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getUserById } from "@/data/user";
import authConfig from "@/auth.config";
import { db } from "@/lib/db";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // If the user is signing in with a provider other than credentials, allow sign in
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);

      // If the user doesn't exist, or the user's email isn't verified, don't allow sign in
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (token.user && session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token }) {
      if (token?.sub) {
        const user = await getUserById(token.sub);
        if (user) {
          token.role = user.role;
        }
      }
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
