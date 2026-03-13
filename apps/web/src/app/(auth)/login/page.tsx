import { Metadata } from 'next';
import { LoginForm } from '@/src/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Masuk',
};

export default function LoginPage() {
  return <LoginForm />;
}
