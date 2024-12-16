import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Step2Schema } from '@/lib/validation/auth';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type Step2FormValues = z.infer<typeof Step2Schema>;

interface StepTwoProps {
  onSubmit: (data: Step2FormValues) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

export function StepTwo({ onSubmit, onBack, isLoading }: StepTwoProps) {
  const [isCheckingStore, setIsCheckingStore] = useState(false);
  
  const form = useForm<Step2FormValues>({
    resolver: zodResolver(Step2Schema),
    defaultValues: {
      storeName: '',
    },
  });

  const checkStoreNameAvailability = async (storeName: string): Promise<boolean> => {
    if (!storeName || storeName.length < 2) return false;
    
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('store_name', { count: 'exact', head: true })
        .eq('store_name', storeName);

      if (error) throw error;
      return count === 0; // Available if no matches found
    } catch (error) {
      console.error('Store name check error:', error);
      return false;
    }
  };

  const handleSubmit = async (data: Step2FormValues) => {
    setIsCheckingStore(true);
    try {
      const isAvailable = await checkStoreNameAvailability(data.storeName);
      if (!isAvailable) {
        form.setError('storeName', {
          type: 'manual',
          message: 'Store name is already taken',
        });
        return;
      }
      await onSubmit(data);
    } finally {
      setIsCheckingStore(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="storeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="My Awesome Store"
                  disabled={isLoading}
                  onChange={async (e) => {
                    const value = e.target.value;
                    field.onChange(value);
                    
                    if (value.length >= 2) {
                      setIsCheckingStore(true);
                      try {
                        const isAvailable = await checkStoreNameAvailability(value);
                        if (!isAvailable) {
                          form.setError('storeName', {
                            type: 'manual',
                            message: 'Store name is already taken',
                          });
                        } else {
                          form.clearErrors('storeName');
                        }
                      } finally {
                        setIsCheckingStore(false);
                      }
                    }
                  }}
                />
              </FormControl>
              {isCheckingStore && (
                <p className="text-sm text-muted-foreground">
                  Checking availability...
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full"
            disabled={isLoading}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || isCheckingStore}
          >
            {isLoading ? 'Creating Store...' : 'Create Store'}
          </Button>
        </div>
      </form>
    </Form>
  );
}