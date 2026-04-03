'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, User, UserRoundPen } from 'lucide-react';
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
import { ROUTES } from '@/src/lib/constants';
import api from '@/src/lib/axios';

const completeProfileSchema = z.object({
  role: z.enum(['CUSTOMER', 'ORGANIZER']),
  referralCode: z.string().optional(),
});

type CompleteProfileData = z.infer<typeof completeProfileSchema>;

export default function CompleteProfileForm() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const partialUser = (session as any)?.partialUser;
  const isNewUser = (session as any)?.isNewUser;

  useEffect(() => {
    // If not authenticated or not a new user, redirect away
    if (status === 'unauthenticated') {
      router.push(ROUTES.LOGIN);
    } else if (status === 'authenticated' && !isNewUser) {
      router.push(ROUTES.HOME); 
    }
  }, [status, isNewUser, router]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompleteProfileData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      role: 'CUSTOMER',
    },
  });

  const role = watch('role');

  const onSubmit = async (data: CompleteProfileData) => {
    setIsLoading(true);
    setError('');

    try {
      // Hit social-register backend directly
      const response = await api.post('/auth/social-register', {
        email: partialUser?.email || '',
        firstName: partialUser?.firstName || '',
        lastName: partialUser?.lastName || '',
        role: data.role,
        referralCode: data.referralCode || undefined,
      });

      // Backend returns registered user & tokens.
      // We must tell NextAuth to re-fetch the session, or sign out and sign in again
      // Wait, we can't easily inject the new TokenPair into the existing NextAuth session without a custom trigger
      // The easiest way is to push the token inside session using 'jwt' callback `update` method, but `update` triggers `jwt` with only `session` object.
      // So we will just force SignOut, and let the user login again, OR we can use the `signIn` 'credentials' with a special flag.
      // Because we don't have the user's password, we cannot use credentials.
      
      // Since it's social login, signing in again via Google will now NOT be a new user!
      // But we don't want them to click Google again.
      // Actually, since NextAuth session relies on the JWT callback, 
      // if we just sign out, they have to click Google again... that's bad UX.
      // Alternatively, we let NextAuth know the new backend Token.
      // NextAuth `update()` can pass data to the `jwt` callback!
      
      await update({
         backendToken: response.data.data.tokens.accessToken,
         user: response.data.data.user
      });

      // After update, if successful, redirect
      if (data.role === 'ORGANIZER') {
        router.push(ROUTES.DASHBOARD);
      } else {
        router.push(ROUTES.HOME);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    await signOut({ callbackUrl: ROUTES.LOGIN });
  };

  if (status === 'loading' || !isNewUser) {
    return (
      <div className='flex justify-center p-8'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-center text-2xl font-bold'>
          Lengkapi Profil
        </CardTitle>
        <CardDescription className='text-center'>
          Hai {partialUser?.firstName}, tinggal selangkah lagi untuk menyelesaikan pendaftaran Anda.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>
          {error && <p className='text-sm text-destructive text-center'>{error}</p>}

          <div className='space-y-2'>
            <Label>Daftar Sebagai</Label>
            <Select
              value={role}
              onValueChange={(value) =>
                setValue('role', value as 'CUSTOMER' | 'ORGANIZER')
              }
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Pilih role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='CUSTOMER'>
                  <div className='flex items-center'>
                    <User className='mr-2 h-4 w-4' />
                    Peserta
                  </div>
                </SelectItem>
                <SelectItem value='ORGANIZER'>
                  <div className='flex items-center'>
                    <UserRoundPen className='mr-2 h-4 w-4' />
                    Penyelenggara Event
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className='text-destructive text-sm'>{errors.role.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='referralCode'>Kode Referral (Opsional)</Label>
            <Input
              id='referralCode'
              placeholder='REF-XXXXXXXX'
              {...register('referralCode')}
            />
            {watch('referralCode') && (
              <p className='text-sm text-green-600'>
                Pastikan kode referral valid untuk mendapatkan poin!
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className='flex flex-col gap-3'>
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Selesaikan Pendaftaran
          </Button>
          <Button 
            type='button' 
            variant='ghost' 
            className='w-full' 
            onClick={handleCancel}
            disabled={isLoading}
          >
            Batal
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
