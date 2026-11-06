import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
          });
          
          // 1. DEFENSIVE PARSING: Read raw text first so HTML errors don't crash the app
          const text = await res.text();
          
          if (!res.ok) {
            console.error(`Backend Login Error (${res.status}):`, text);
            return null; // Gracefully reject the login
          }

          // 2. Parse the verified JSON
          const user = JSON.parse(text);

          if (user) {
            return user; 
          }
          return null;
        } catch (error) {
          console.error("NextAuth Backend Connection Error - Is Node.js running on port 5000?", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tenantId = (user as any).tenantId;
        token.companyName = (user as any).companyName;
        token.role = (user as any).role || "client"; // <-- Now capturing Role!
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).tenantId = token.tenantId;
        (session.user as any).companyName = token.companyName;
        (session.user as any).role = token.role; // <-- Passing Role to UI!
      }
      return session;
    }
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login", 
  }
});

export { handler as GET, handler as POST };