import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '@/types/product';

interface BasicDetailsProps {
  form: UseFormReturn<Product>;
}

export function BasicDetails({ form }: BasicDetailsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product name</FormLabel>
            <FormControl>
              <Input placeholder="Enter product name" {...field} />
            </FormControl>
            <FormDescription>
              Customers will see this name in your store
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your product..."
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Write a detailed description of your product
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}