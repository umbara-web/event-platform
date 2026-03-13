'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
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

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password minimal 8 karakter')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/,
        'Password harus mengandung huruf kecil, huruf besar, dan angka'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordFormData) =>
      authApi.resetPassword({
        token: token || '',
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }),
    onSuccess: () => {
      setIsSuccess(true);
    },
    onError: (error: any) => {
      toast({
        title: 'Gagal reset password',
        description:
          error.response?.data?.message ||
          'Token tidak valid atau sudah kadaluarsa',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) {
      toast({
        title: 'Token tidak ditemukan',
        description: 'Link reset password tidak valid',
        variant: 'destructive',
      });
      return;
    }
    mutation.mutate(data);
  };

  if (!token) {
    return (
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-destructive text-2xl font-bold'>
            Link Tidak Valid
          </CardTitle>
          <CardDescription>
            Link reset password tidak valid atau sudah kadaluarsa
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild className='w-full'>
            <Link href={ROUTES.FORGOT_PASSWORD}>Minta Link Baru</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1 text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
            <CheckCircle className='h-8 w-8 text-green-600' />
          </div>
          <CardTitle className='text-2xl font-bold'>
            Password Berhasil Direset
          </CardTitle>
          <CardDescription>
            Password Anda telah berhasil diubah. Silakan login dengan password
            baru.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild className='w-full'>
            <Link href={ROUTES.LOGIN}>Login Sekarang</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold'>Reset Password</CardTitle>
        <CardDescription>
          Masukkan password baru untuk akun Anda
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='newPassword'>Password Baru</Label>
            <div className='relative'>
              <Input
                id='newPassword'
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                {...register('newPassword')}
                error={errors.newPassword?.message}
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='absolute top-0 right-0 h-10 w-10'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </Button>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Konfirmasi Password</Label>
            <div className='relative'>
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='••••••••'
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='absolute top-0 right-0 h-10 w-10'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type='submit'
            className='w-full'
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Reset Password
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default ResetPasswordForm;
