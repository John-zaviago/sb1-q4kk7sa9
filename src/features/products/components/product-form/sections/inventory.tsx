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
import { Switch } from '@/components/ui/switch';
import { Product } from '@/types/product';

interface InventoryProps {
  form: UseFormReturn<Product>;
}

export function Inventory({ form }: InventoryProps) {
  const trackQuantity = form.watch('trackQuantity');

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="sku"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
            <FormControl>
              <Input placeholder="Enter SKU" {...field} />
            </FormControl>
            <FormDescription>
              A unique identifier for your product
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="barcode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Barcode (ISBN, UPC, GTIN, etc.)</FormLabel>
            <FormControl>
              <Input placeholder="Enter barcode" {...field} />
            </FormControl>
            <FormDescription>
              A unique barcode for your product (optional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="trackQuantity"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Track quantity</FormLabel>
              <FormDescription>
                Track and manage inventory quantities
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {trackQuantity && (
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>
                Current stock quantity
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}