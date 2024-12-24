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
        
        // Check if the user exists and fetch the invalidate status
        const existingUser = await User.findOne({ userId: profile.sub });

        // If the user exists and is invalidated, reject the sign-in
        if (existingUser && existingUser.invalidate) {
          console.warn(`Sign-in attempt for invalidated user: ${existingUser.userName}`);
          return false; // Reject sign-in
        }

        // Upsert user (create if not exists)
        await User.findOneAndUpdate(
          { userId: profile.sub }, // Match by Google user ID
          { userName: user.name, email: user.email }, // Update fields
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
  session: {
    strategy: "jwt", // Use JSON Web Tokens (default)
    maxAge: 30*60, // 30 minutes in seconds
  },
  secret: process.env.NEXTAUTH_SECRET, // Add this if not already included
};

export default NextAuth(authOptions);