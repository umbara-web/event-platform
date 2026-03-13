import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/src/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Lupa Password',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
