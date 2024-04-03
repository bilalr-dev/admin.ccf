// Import NextAuth and session handling functions
// Імпорт NextAuth та функцій обробки сесій

import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

// Define email addresses for admin users
// Визначте електронні адреси для адміністраторів

const adminEmails = ['bil.rahaoui94@gmail.com'];

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
        return session;
      } else {
        return false;
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
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw 'not an admin';
  }
}
