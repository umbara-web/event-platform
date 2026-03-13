'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { useAuth } from '@/src/hooks/useAuth';
import { ROUTES } from '@/src/lib/constants';

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'Nama depan minimal 2 karakter')
      .max(100, 'Nama depan terlalu panjang'),
    lastName: z
      .string()
      .min(2, 'Nama belakang minimal 2 karakter')
      .max(100, 'Nama belakang terlalu panjang'),
    email: z.string().email('Email tidak valid'),
    password: z
      .string()
      .min(8, 'Password minimal 8 karakter')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/,
        'Password harus mengandung huruf kecil, huruf besar, dan angka'
      ),
    confirmPassword: z.string(),
    role: z.enum(['CUSTOMER', 'ORGANIZER']),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref') || '';

  const { register: registerUser, isRegisterLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'CUSTOMER',
      referralCode: referralCode,
    },
  });

  const role = watch('role');

  const onSubmit = (data: RegisterFormData) => {
    registerUser({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      referralCode: data.referralCode || undefined,
    });
  };

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold'>Daftar</CardTitle>
        <CardDescription>
          Buat akun baru untuk mulai menggunakan platform
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>
          {/* Name Fields */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='firstName'>Nama Depan</Label>
              <Input
                id='firstName'
                placeholder='John'
                {...register('firstName')}
                error={errors.firstName?.message}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lastName'>Nama Belakang</Label>
              <Input
                id='lastName'
                placeholder='Doe'
                {...register('lastName')}
                error={errors.lastName?.message}
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Role */}
          <div className='space-y-2'>
            <Label>Daftar Sebagai</Label>
            <Select
              value={role}
              onValueChange={(value) =>
                setValue('role', value as 'CUSTOMER' | 'ORGANIZER')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Pilih role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='CUSTOMER'>Peserta</SelectItem>
                <SelectItem value='ORGANIZER'>Penyelenggara Event</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className='text-destructive text-sm'>{errors.role.message}</p>
            )}
          </div>

          {/* Password */}
          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
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

          {/* Confirm Password */}
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

          {/* Referral Code */}
          <div className='space-y-2'>
            <Label htmlFor='referralCode'>Kode Referral (Opsional)</Label>
            <Input
              id='referralCode'
              placeholder='REF-XXXXXXXX'
              {...register('referralCode')}
            />
            {referralCode && (
              <p className='text-sm text-green-600'>
                Anda akan mendapat diskon 10% untuk transaksi pertama!
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <Button type='submit' className='w-full' disabled={isRegisterLoading}>
            {isRegisterLoading && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Daftar
          </Button>
          <p className='text-muted-foreground text-center text-sm'>
            Sudah punya akun?{' '}
            <Link href={ROUTES.LOGIN} className='text-primary hover:underline'>
              Masuk
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

export default RegisterForm;
