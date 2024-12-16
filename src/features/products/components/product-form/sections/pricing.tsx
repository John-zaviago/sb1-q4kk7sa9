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
import { Product } from '@/types/product';

interface PricingProps {
  form: UseFormReturn<Product>;
}

export function Pricing({ form }: PricingProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
              />
            </FormControl>
            <FormDescription>Set your product's selling price</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="compareAtPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Compare at price</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormDescription>
              Original price before discount (optional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cost"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cost per item</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormDescription>
              Customers won't see this price (optional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}