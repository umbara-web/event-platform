import { Metadata } from 'next';
import { Suspense } from 'react';
import { RegisterForm } from '@/src/components/auth/RegisterForm';
import { LoadingSpinner } from '@/src/components/shared/LoadingSpinner';

export const metadata: Metadata = {
  title: 'Daftar',
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RegisterForm />
    </Suspense>
  );
}
