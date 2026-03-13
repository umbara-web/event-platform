import { Metadata } from 'next';
import { Suspense } from 'react';
import { ResetPasswordForm } from '@/src/components/auth/ResetPasswordForm';
import { LoadingSpinner } from '@/src/components/shared/LoadingSpinner';

export const metadata: Metadata = {
  title: 'Reset Password',
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
