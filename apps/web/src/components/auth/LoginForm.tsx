'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
import { useAuth } from '@/src/hooks/useAuth';
import { ROUTES } from '@/src/lib/constants';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, isLoginLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold'>Masuk</CardTitle>
        <CardDescription>
          Masukkan email dan password untuk masuk ke akun Anda
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

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='password'>Password</Label>
              <Link
                href={ROUTES.FORGOT_PASSWORD}
                className='text-primary text-sm hover:underline'
              >
                Lupa password?
              </Link>
            </div>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                {...register('password')}
                error={errors.password?.message}
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
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <Button type='submit' className='w-full' disabled={isLoginLoading}>
            {isLoginLoading && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Masuk
          </Button>
          <p className='text-muted-foreground text-center text-sm'>
            Belum punya akun?{' '}
            <Link
              href={ROUTES.REGISTER}
              className='text-primary hover:underline'
            >
              Daftar sekarang
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

export default LoginForm;
