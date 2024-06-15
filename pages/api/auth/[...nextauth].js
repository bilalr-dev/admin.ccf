import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

// Define email addresses for admin users
const adminEmails = ['bil.rahaoui94@gmail.com'];

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({ session, token, user }) => {
      if (adminEmails.includes(session?.user?.email)) {
        session.user.isAdmin = true; // Set an isAdmin flag on the session
      } else {
        session.user.isAdmin = false;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect unauthorized users to the login page
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.isAdmin) {
    res.status(401).json({ error: 'Unauthorized: Not an admin' });
    return false; // Ensure the caller knows the request is unauthorized
  }
  return true;
}
