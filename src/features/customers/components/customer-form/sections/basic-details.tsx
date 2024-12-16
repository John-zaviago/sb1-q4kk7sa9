import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Customer } from '@/types/customer';
import { CustomerService } from '../../../services/customer-service';
import { useState } from 'react';

interface BasicDetailsProps {
  form: UseFormReturn<Customer>;
}

export function BasicDetails({ form }: BasicDetailsProps) {
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="john@example.com" 
                {...field}
                onChange={async (e) => {
                  field.onChange(e);
                  const value = e.target.value;
                  
                  if (value && value.includes('@')) {
                    setIsCheckingEmail(true);
                    try {
                      const isAvailable = await CustomerService.checkEmailAvailability(value);
                      if (!isAvailable) {
                        form.setError('email', {
                          type: 'manual',
                          message: 'This email is already in use',
                        });
                      } else {
                        form.clearErrors('email');
                      }
                    } finally {
                      setIsCheckingEmail(false);
                    }
                  }
                }}
              />
            </FormControl>
            {isCheckingEmail && (
              <p className="text-sm text-muted-foreground">
                Checking email availability...
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone number</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="+1234567890" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}