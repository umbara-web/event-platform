import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import api from '@/src/lib/axios';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'user@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        try {
          const res = await api.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          const user = res.data.data.user;
          const token = res.data.data.token;

          if (user && token) {
            // Include token in the user object so it can be passed to jwt callback
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              token: token,
            };
          }
          return null;
        } catch (error: any) {
          throw new Error(
            error.response?.data?.error || 'Authentication failed'
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'supersecretnextauthkey123',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
