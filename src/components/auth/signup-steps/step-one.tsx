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
import { Step1Schema } from '@/lib/validation/auth';
import { Link } from 'react-router-dom';
import { useSignupStore } from '@/lib/auth/signup-store';
import { useEffect } from 'react';

type Step1FormValues = z.infer<typeof Step1Schema>;

interface StepOneProps {
  onSubmit: (data: Step1FormValues) => void;
}

export function StepOne({ onSubmit }: StepOneProps) {
  const { step1Data, setStep1Data } = useSignupStore();

  const form = useForm<Step1FormValues>({
    resolver: zodResolver(Step1Schema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  // Load saved data when component mounts
  useEffect(() => {
    if (step1Data) {
      form.reset(step1Data);
    }
  }, [step1Data, form]);

  const handleSubmit = (data: Step1FormValues) => {
    setStep1Data(data);
    onSubmit(data);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </Form>
      <div className="text-sm text-muted-foreground text-center mt-4">
        Already have an account?{' '}
        <Link
          to="/auth/login"
          className="text-primary hover:text-primary/90 font-medium"
        >
          Sign in
        </Link>
      </div>
    </>
  );
}