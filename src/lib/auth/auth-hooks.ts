import { useCallback } from 'react';
import { useAuthStore } from './auth-store';
import { AuthService } from './auth-service';
import { SignUpData, LoginData } from './types';
import { toast } from 'sonner';

export function useAuth() {
  const { user, error, isLoading, setUser, setError, setLoading } = useAuthStore();

  const signUp = useCallback(async (data: SignUpData) => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.signUp(data);
      toast.success('Account created successfully! Please check your email for verification.');
    } catch (error: any) {
      setError(error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading]);

  const login = useCallback(async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      const user = await AuthService.login(data);
      setUser(user);
      toast.success('Signed in successfully!');
    } catch (error: any) {
      setError(error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setUser, setError, setLoading]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.logout();
      setUser(null);
      toast.success('Signed out successfully!');
    } catch (error: any) {
      setError(error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setUser, setError, setLoading]);

  return {
    user,
    error,
    isLoading,
    signUp,
    login,
    logout,
  };
}