// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session, token }) {
      // attach user id (from token) if needed
      // but Google doesn't always return a user ID
      // use token.sub as user id (google unique id)
      session.userId = token.sub; 
      return session;
    }
  }
};

export default NextAuth(authOptions);