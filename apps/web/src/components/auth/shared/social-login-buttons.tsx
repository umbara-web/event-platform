'use client';

import Image from 'next/image';
import { Button } from '@/src/components/ui/button';
import { signIn } from 'next-auth/react';

export default function SocialLoginButtons() {
  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <div className='grid grid-cols-2 gap-4'>
      <Button
        variant='outline'
        className='w-full cursor-pointer gap-2'
        type='button'
        onClick={() => handleSocialLogin('google')}
      >
        <Image src='./icons/google.svg' alt='Google' width={20} height={20} />
        Google
      </Button>
      <Button
        variant='outline'
        className='w-full cursor-pointer gap-2'
        type='button'
        onClick={() => handleSocialLogin('facebook')}
      >
        <Image
          src='./icons/facebook.svg'
          alt='Facebook'
          width={20}
          height={20}
        />
        Facebook
      </Button>
    </div>
  );
}
