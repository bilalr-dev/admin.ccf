// Import NextAuth and session handling functions
import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

// Define email addresses for admin users
const adminEmails = ['bil.rahaoui94@gmail.com', 'testcclznu@gmail.com'].map(email => email.toLowerCase());

// Configuration options for NextAuth
export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  
  // Callback to check if the user is an admin during session creation
  callbacks: {
    session: ({ session, token, user }) => {
      const userEmail = session?.user?.email?.toLowerCase();
      console.log('Session callback triggered');
      console.log('Session:', session);
      console.log('User email:', userEmail);

      if (adminEmails.includes(userEmail)) {
        console.log('User is an admin');
        return session;
      } else {
        console.log('User is not an admin');
        return false;
      }
    },
  },
};

// Export NextAuth instance with configured options
export default NextAuth(authOptions);

// Function to check if a request is from an admin user
export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const userEmail = session?.user?.email?.toLowerCase();
  if (!adminEmails.includes(userEmail)) {
    res.status(401);
    res.end();
    throw 'not an admin';
  }
}
