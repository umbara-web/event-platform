import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    isNewUser?: boolean;
    partialUser?: Partial<User> & { firstName?: string; lastName?: string };
    user: {
      id?: string;
      role?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
    role?: string;
    token?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
    isNewUser?: boolean;
    partialUser?: { email?: string; firstName?: string; lastName?: string };
  }
}
