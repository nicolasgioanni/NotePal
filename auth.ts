import NextAuth from "next-auth";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import authConfig from "./auth.config";
import { getUserById, updateUserById } from "@/db/firebase/user";
import { updateUser } from "@/db/firebase/user";
import Resend from "next-auth/providers/resend";
import { cert } from "firebase-admin/app";

export const { handlers, signIn, signOut, auth } = NextAuth({
  events: {
    async linkAccount({ user }) {
      if (!user.id) return;
      await updateUserById(user.id, { emailVerified: new Date() });
    },
  },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        return null;
      }
      token.name = existingUser.name;

      return token;
    },
  },
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.AUTH_FIREBASE_PROJECT_ID,
      clientEmail: process.env.AUTH_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.AUTH_FIREBASE_PRIVATE_KEY,
    }),
  }),
  session: { strategy: "jwt" },
  providers: [
    Resend({ from: "no-reply@mynotepal.ai" }),
    ...authConfig.providers,
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-email",
  },
});
