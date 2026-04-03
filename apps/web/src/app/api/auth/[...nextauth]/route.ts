import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
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
          const tokenPair = res.data.data.tokens;

          if (user && tokenPair) {
            // Include token in the user object so it can be passed to jwt callback
            return {
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              role: user.role,
              token: tokenPair.accessToken, // NextAuth expects a flat object usually
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    })
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // 0. Handle manual session update after complete-profile
      if (trigger === 'update' && session?.backendToken) {
        token.accessToken = session.backendToken;
        token.id = session.user.id;
        token.role = session.user.role;
        token.isNewUser = false;
        token.partialUser = undefined;
        return token;
      }

      // 1. Social Login
      if (account && (account.provider === 'google' || account.provider === 'facebook')) {
        const email = user?.email || '';
        const nameParts = (user?.name || '').split(' ');
        const firstName = nameParts[0] || email.split('@')[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        try {
          const res = await api.post('/auth/social-login', {
            email,
            firstName,
            lastName,
          });

          const data = res.data.data;
          if (data.isNewUser) {
            token.isNewUser = true;
            token.partialUser = data.partialUser;
          } else {
            token.isNewUser = false;
            token.id = data.user.id;
            token.role = data.user.role;
            token.accessToken = data.tokens.accessToken;
          }
        } catch (error) {
          console.error('Social Login Error:', error);
        }
      } 
      // 2. Credentials Login
      else if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = (user as any).token;
        token.isNewUser = false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
        (session as any).isNewUser = token.isNewUser;
        (session as any).partialUser = token.partialUser;
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
