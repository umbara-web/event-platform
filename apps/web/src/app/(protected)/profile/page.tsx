'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, Loader2, Copy, Gift, Wallet, Check } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { Separator } from '@/src/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/ui/tabs';
import { toast } from '@/src/components/ui/use-toast';
import { useAuthStore } from '@/src/stores/authStore';
import usersApi from '@/src/lib/api/users';
import { QUERY_KEYS } from '@/src/lib/constants';
import { formatRupiah, formatDate, getInitials } from '@/src/lib/utils';

const profileSchema = z.object({
  firstName: z.string().min(2, 'Nama depan minimal 2 karakter'),
  lastName: z.string().min(2, 'Nama belakang minimal 2 karakter'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch points
  const { data: pointsData } = useQuery({
    queryKey: [QUERY_KEYS.POINTS],
    queryFn: () => usersApi.getPointsBalance(),
  });

  // Fetch coupons
  const { data: couponsData } = useQuery({
    queryKey: [QUERY_KEYS.COUPONS],
    queryFn: () => usersApi.getCoupons(),
  });

  const points = pointsData?.data;
  const coupons = couponsData?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: (response) => {
      if (response.data) {
        setUser(response.data);
        toast({
          title: 'Profil diperbarui',
          description: 'Data profil Anda berhasil disimpan',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Gagal memperbarui profil',
        description: error.response?.data?.message || 'Terjadi kesalahan',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await usersApi.uploadProfileImage(file);
      if (response.data) {
        setUser(response.data);
        toast({
          title: 'Foto profil diperbarui',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Gagal mengupload foto',
        description: error.response?.data?.message || 'Terjadi kesalahan',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyReferral = async () => {
    if (user?.referralCode) {
      await navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      toast({
        title: 'Kode referral disalin',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!user) return null;

  return (
    <div className='container py-8'>
      <h1 className='mb-8 text-2xl font-bold'>Profil Saya</h1>

      <div className='grid gap-8 lg:grid-cols-3'>
        {/* Profile Card */}
        <div className='lg:col-span-1'>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex flex-col items-center'>
                {/* Avatar */}
                <div className='relative'>
                  <Avatar className='h-24 w-24'>
                    <AvatarImage src={user.profileImage || ''} />
                    <AvatarFallback className='text-2xl'>
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor='avatar-upload'
                    className='bg-primary text-primary-foreground hover:bg-primary/90 absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full'
                  >
                    {isUploading ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Camera className='h-4 w-4' />
                    )}
                  </label>
                  <input
                    id='avatar-upload'
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </div>

                <h2 className='mt-4 text-xl font-semibold'>
                  {user.firstName} {user.lastName}
                </h2>
                <p className='text-muted-foreground'>{user.email}</p>
                <Badge className='mt-2' variant='secondary'>
                  {user.role === 'ORGANIZER' ? 'Penyelenggara' : 'Peserta'}
                </Badge>

                <Separator className='my-4 w-full' />

                {/* Referral Code */}
                <div className='w-full space-y-2'>
                  <p className='text-muted-foreground text-sm'>Kode Referral</p>
                  <div className='flex items-center gap-2'>
                    <code className='bg-muted flex-1 rounded-lg px-3 py-2 text-center font-mono text-sm'>
                      {user.referralCode}
                    </code>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={handleCopyReferral}
                    >
                      {copied ? (
                        <Check className='h-4 w-4' />
                      ) : (
                        <Copy className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    Bagikan kode ini dan dapatkan 10.000 poin setiap ada yang
                    mendaftar!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className='lg:col-span-2'>
          <Tabs defaultValue='profile'>
            <TabsList className='w-full'>
              <TabsTrigger value='profile' className='flex-1'>
                Edit Profil
              </TabsTrigger>
              <TabsTrigger value='points' className='flex-1'>
                Poin & Kupon
              </TabsTrigger>
            </TabsList>

            <TabsContent value='profile' className='mt-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Profil</CardTitle>
                  <CardDescription>
                    Perbarui informasi profil Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div className='grid gap-4 sm:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label htmlFor='firstName'>Nama Depan</Label>
                        <Input
                          id='firstName'
                          {...register('firstName')}
                          error={errors.firstName?.message}
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='lastName'>Nama Belakang</Label>
                        <Input
                          id='lastName'
                          {...register('lastName')}
                          error={errors.lastName?.message}
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label>Email</Label>
                      <Input value={user.email} disabled />
                      <p className='text-muted-foreground text-xs'>
                        Email tidak dapat diubah
                      </p>
                    </div>

                    <Button
                      type='submit'
                      disabled={!isDirty || updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending && (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      )}
                      Simpan Perubahan
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='points' className='mt-4 space-y-4'>
              {/* Points Balance */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Wallet className='h-5 w-5' />
                    Saldo Poin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-primary text-3xl font-bold'>
                    {formatRupiah(points?.totalBalance || 0)}
                  </p>
                  {points?.points && points.points.length > 0 && (
                    <div className='mt-4 space-y-2'>
                      <p className='text-muted-foreground text-sm'>
                        Detail poin:
                      </p>
                      {points.points.map((point) => (
                        <div
                          key={point.id}
                          className='bg-muted flex justify-between rounded-lg p-3 text-sm'
                        >
                          <span>
                            {formatRupiah(point.amount)} ({point.source})
                          </span>
                          <span className='text-muted-foreground'>
                            Exp: {formatDate(point.expiresAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Coupons */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Gift className='h-5 w-5' />
                    Kupon Saya
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {coupons.length > 0 ? (
                    <div className='space-y-3'>
                      {coupons.map((coupon) => (
                        <div
                          key={coupon.id}
                          className='flex items-center justify-between rounded-lg border p-4'
                        >
                          <div>
                            <p className='font-semibold'>{coupon.code}</p>
                            <p className='text-muted-foreground text-sm'>
                              Diskon{' '}
                              {coupon.discountType === 'PERCENTAGE'
                                ? `${coupon.discountValue}%`
                                : formatRupiah(coupon.discountValue)}
                            </p>
                            <p className='text-muted-foreground text-xs'>
                              Berlaku hingga {formatDate(coupon.expiresAt)}
                            </p>
                          </div>
                          <Badge
                            variant={coupon.isUsed ? 'secondary' : 'default'}
                          >
                            {coupon.isUsed ? 'Sudah digunakan' : 'Tersedia'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-muted-foreground py-8 text-center'>
                      Anda belum memiliki kupon
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
