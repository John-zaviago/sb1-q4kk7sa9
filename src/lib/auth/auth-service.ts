import { supabase } from '../supabase';
import { SignUpData, LoginData, AuthError } from './types';
import { User } from '@/types';

export class AuthService {
  private static async checkStoreNameAvailability(storeName: string): Promise<boolean> {
    console.log('Checking store name availability:', storeName);
    const { count, error } = await supabase
      .from('profiles')
      .select('store_name', { count: 'exact', head: true })
      .eq('store_name', storeName);

    if (error) {
      console.error('Store name check error:', error);
      throw error;
    }
    
    console.log('Store name availability result:', { count });
    return count === 0;
  }

  static async signUp(data: SignUpData): Promise<void> {
    console.log('Starting signup process for:', data.email);
    try {
      // Step 1: Check store name availability
      console.log('Step 1: Checking store name availability');
      const isStoreNameAvailable = await this.checkStoreNameAvailability(data.storeName);
      if (!isStoreNameAvailable) {
        console.error('Store name is already taken:', data.storeName);
        throw new Error('Store name is already taken');
      }
      console.log('Store name is available');

      // Step 2: Sign up the user with Supabase Auth
      console.log('Step 2: Creating auth user');
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            store_name: data.storeName,
          },
        },
      });

      if (signUpError) {
        console.error('Auth signup error:', signUpError);
        throw signUpError;
      }
      if (!authData.user) {
        console.error('No user data returned from auth signup');
        throw new Error('No user data returned');
      }
      console.log('Auth user created successfully:', authData.user.id);

      // Step 3: Create profile entry
      console.log('Step 3: Creating user profile');
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: data.email,
            full_name: data.fullName,
            store_name: data.storeName,
          },
        ])
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }
      console.log('Profile created successfully');

      console.log('Signup process completed successfully');
    } catch (error: any) {
      console.error('Signup process failed:', {
        error,
        message: error.message,
        code: error.code,
        details: error.details,
      });
      throw {
        message: error.message || 'Failed to create account',
        code: error.code,
      };
    }
  }

  static async login(data: LoginData): Promise<User> {
    console.log('Starting login process for:', data.email);
    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        console.error('Login error:', signInError);
        throw signInError;
      }
      if (!authData.user) {
        console.error('No user data returned from login');
        throw new Error('No user data returned');
      }
      console.log('Auth login successful');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw profileError;
      }
      if (!profile) {
        console.error('Profile not found');
        throw new Error('Profile not found');
      }
      console.log('Profile fetched successfully');

      return {
        id: authData.user.id,
        email: profile.email,
        fullName: profile.full_name,
        storeName: profile.store_name,
        createdAt: new Date(profile.created_at),
      };
    } catch (error: any) {
      console.error('Login process failed:', error);
      throw {
        message: error.message || 'Failed to sign in',
        code: error.code,
      };
    }
  }

  static async logout(): Promise<void> {
    console.log('Starting logout process');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout process failed:', error);
      throw error;
    }
  }
}