'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/src/stores/authStore';
import authApi, { LoginData, RegisterData } from '@/src/lib/api/auth';
import { ROUTES, QUERY_KEYS } from '@/src/lib/constants';
import { toast } from '@/src/components/ui/use-toast';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    user,
    isAuthenticated,
    isLoading,
    setAuth,
    logout: storeLogout,
  } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { user, tokens } = response.data!;
      setAuth(user, tokens.accessToken, tokens.refreshToken);

      toast({
        title: 'Login berhasil',
        description: `Selamat datang kembali, ${user.firstName}!`,
      });

      // Redirect based on role
      if (user.role === 'ORGANIZER') {
        router.push(ROUTES.DASHBOARD);
      } else {
        router.push(ROUTES.HOME);
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Login gagal',
        description: error.response?.data?.message || 'Terjadi kesalahan',
        variant: 'destructive',
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      const { user, tokens } = response.data!;
      setAuth(user, tokens.accessToken, tokens.refreshToken);

      toast({
        title: 'Registrasi berhasil',
        description: `Selamat datang, ${user.firstName}!`,
      });

      // Redirect based on role
      if (user.role === 'ORGANIZER') {
        router.push(ROUTES.DASHBOARD);
      } else {
        router.push(ROUTES.HOME);
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Registrasi gagal',
        description: error.response?.data?.message || 'Terjadi kesalahan',
        variant: 'destructive',
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { refreshToken } = useAuthStore.getState();
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    },
    onSuccess: () => {
      storeLogout();
      queryClient.clear();
      router.push(ROUTES.HOME);

      toast({
        title: 'Logout berhasil',
        description: 'Sampai jumpa kembali!',
      });
    },
    onError: () => {
      // Still logout on error
      storeLogout();
      queryClient.clear();
      router.push(ROUTES.HOME);
    },
  });

  const login = (data: LoginData) => loginMutation.mutate(data);
  const register = (data: RegisterData) => registerMutation.mutate(data);
  const logout = () => logoutMutation.mutate();

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  };
}

export default useAuth;
