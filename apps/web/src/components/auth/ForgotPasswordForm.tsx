'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { toast } from '@/src/components/ui/use-toast';
import authApi from '@/src/lib/api/auth';
import { ROUTES } from '@/src/lib/constants';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isEmailSent, setIsEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => {
      setIsEmailSent(true);
    },
    onError: () => {
      // Still show success to prevent email enumeration
      setIsEmailSent(true);
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    mutation.mutate(data.email);
  };

  if (isEmailSent) {
    return (
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1 text-center'>
          <div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
            <Mail className='text-primary h-8 w-8' />
          </div>
          <CardTitle className='text-2xl font-bold'>Cek Email Anda</CardTitle>
          <CardDescription>
            Kami telah mengirim link reset password ke{' '}
            <span className='text-foreground font-medium'>
              {getValues('email')}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className='text-muted-foreground space-y-4 text-center text-sm'>
          <p>
            Klik link di email untuk mengatur ulang password Anda. Link akan
            kadaluarsa dalam 1 jam.
          </p>
          <p>
            Tidak menerima email? Periksa folder spam atau{' '}
            <button
              onClick={() => setIsEmailSent(false)}
              className='text-primary hover:underline'
            >
              coba lagi
            </button>
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild variant='outline' className='w-full'>
            <Link href={ROUTES.LOGIN}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Kembali ke Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold'>Lupa Password?</CardTitle>
        <CardDescription>
          Masukkan email Anda dan kami akan mengirimkan link untuk reset
          password
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='nama@email.com'
              {...register('email')}
              error={errors.email?.message}
            />
          </div>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <Button
            type='submit'
            className='w-full'
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Kirim Link Reset
          </Button>
          <Button asChild variant='ghost' className='w-full'>
            <Link href={ROUTES.LOGIN}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Kembali ke Login
            </Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default ForgotPasswordForm;
