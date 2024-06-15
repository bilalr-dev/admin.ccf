// Import NextAuth and session handling functions
// Імпорт NextAuth та функцій обробки сесій

import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

// Define email addresses for admin users
// Визначте електронні адреси для адміністраторів

const adminEmails = ['testcclznu@gmail.com'];

// Configuration options for NextAuth
// Опції конфігурації для NextAuth

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
  // Зворотний виклик для перевірки, чи є користувач адміністратором під час створення сесії
  
  callbacks: {
    session: ({ session, token, user }) => {
      if (adminEmails.includes(session?.user?.email)) {
        session.user.isAdmin = true; // Set an isAdmin flag on the session
        return session;
      } else {
        return session; // Still return the session, but not as an admin
      }
    },
  },
};

// Export NextAuth instance with configured options
// Експорт екземпляра NextAuth із налаштованими опціями

export default NextAuth(authOptions);

// Function to check if a request is from an admin user
// Функція для перевірки, чи запит від адміністратора

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.isAdmin) { // Check the isAdmin flag
    res.status(401).json({ error: 'Unauthorized: Not an admin' }); // Send an error response
    return;
  }
}
