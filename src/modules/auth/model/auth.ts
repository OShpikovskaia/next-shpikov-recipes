import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcryptjs from 'bcryptjs';
import { ZodError } from 'zod';

import prisma from '@/shared/lib/prisma';
import { getUserFromDb } from '@/shared/lib/user';

import { signInSchema } from './schema';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials.email || !credentials.password) {
            throw new Error('Email and password is required!');
          }
          const { email, password } = await signInSchema.parseAsync(credentials);

          const user = await getUserFromDb(email);

          if (!user) {
            throw new Error('Invalid credentials.');
          }
          const isPasswordValid = await bcryptjs.compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error('Invalid credentials.');
          }
          return { id: user.id, email: user.email };
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 3600,
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});
