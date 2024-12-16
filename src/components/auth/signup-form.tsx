import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthLayout } from './auth-layout';
import { useAuth } from '@/lib/auth/auth-hooks';
import { toast } from 'sonner';
import { StepOne } from './signup-steps/step-one';
import { StepTwo } from './signup-steps/step-two';
import { z } from 'zod';
import { Step1Schema, Step2Schema } from '@/lib/validation/auth';
import { useSignupStore } from '@/lib/auth/signup-store';
import { supabase } from '@/lib/supabase';

type Step1FormValues = z.infer<typeof Step1Schema>;
type Step2FormValues = z.infer<typeof Step2Schema>;

export function SignUpForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { step1Data, clearData } = useSignupStore();

  // Add auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', {
        event,
        sessionId: session?.user?.id,
        email: session?.user?.email,
        metadata: session?.user?.user_metadata,
      });
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
      clearData();
    };
  }, [clearData]);

  const onStep1Submit = (data: Step1FormValues) => {
    console.log('Step 1 submitted:', data);
    setStep(2);
  };

  const onStep2Submit = async (data: Step2FormValues) => {
    if (!step1Data) {
      toast.error('Please fill in your basic information first');
      setStep(1);
      return;
    }

    console.log('Starting signup process with data:', {
      ...step1Data,
      storeName: data.storeName,
    });

    setIsLoading(true);
    try {
      await signUp({
        fullName: step1Data.fullName,
        email: step1Data.email,
        password: step1Data.password,
        storeName: data.storeName,
      });
      console.log('Signup successful, redirecting to login');
      clearData();
      navigate('/auth/login');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    console.log('Navigating back to step 1');
    setStep(1);
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create your store
          </CardTitle>
          <p className="text-muted-foreground text-center">
            Step {step} of 2: {step === 1 ? 'Basic Information' : 'Store Details'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 ? (
            <StepOne onSubmit={onStep1Submit} />
          ) : (
            <StepTwo
              onSubmit={onStep2Submit}
              onBack={handleBack}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
}