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
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      
      try {
        await connectToDB(); // Connect to MongoDB
        // Upsert user (create if not exists)
        await User.findOneAndUpdate(
          { userId: profile.sub }, // Match by Google user ID
          { userName: user.name, email: user.email}, // Update fields
          { upsert: true, new: true } // Create if doesn't exist
        );
        return true; // Sign-in successful
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false; // Reject sign-in
      }
    },
    async session({ session, token }) {
      session.userId = token.sub; // Attach user ID to session
      return session; // Return the modified session object
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Add this if not already included
};

export default NextAuth(authOptions);
``