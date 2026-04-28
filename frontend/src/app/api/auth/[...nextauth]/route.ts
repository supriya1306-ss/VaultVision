import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { API_BASE_URL } from "@/lib/api";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/google-sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              google_id: user.id,
              email: user.email,
              name: user.name,
              profile_picture: user.image,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            user.backendId = data.user_id;
            return true;
          }
        } catch (error) {
          console.error("Error syncing user to backend:", error);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.backendId = token.backendId;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.backendId = user.backendId;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
