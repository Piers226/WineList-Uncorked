// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDB } from '../../../lib/mongodb';
import User from '../../../models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // user: { name, email, image }
      await connectToDB();
      await User.findOneAndUpdate(
        { userId: profile.sub },
        { userName: user.name, email: user.email, savedWines: [] },
        { upsert: true, new: true }
      );
      return true;
    },
    async session({ session, token }) {
      session.userId = token.sub; 
      return session;
    }
  }
};

export default NextAuth(authOptions);