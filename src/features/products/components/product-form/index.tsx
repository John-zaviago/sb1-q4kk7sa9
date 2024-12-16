import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductSchema } from '../../schemas/product-schema';
import { BasicDetails } from './sections/basic-details';
import { Media } from './sections/media';
import { Pricing } from './sections/pricing';
import { Inventory } from './sections/inventory';
import { Shipping } from './sections/shipping';
import { Organization } from './sections/organization';
import { Product } from '@/types/product';

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: Product) => Promise<void>;
}

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const form = useForm({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: '',
      description: '',
      images: [],
      category: undefined,
      price: 0,
      compareAtPrice: undefined,
      cost: undefined,
      sku: '',
      barcode: '',
      trackQuantity: false,
      quantity: undefined,
      weight: 0,
      weightUnit: 'kg',
      tags: [],
      status: 'draft',
      ...initialData,
    },
  });

  const handleSubmit = async (data: Product) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {initialData ? 'Edit product' : 'Add product'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {initialData
            ? 'Update your product details'
            : 'Add a new product to your store'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="flex items-center gap-4">
            <Button type="submit">Save product</Button>
            <Button type="button" variant="outline">
              Discard
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-6">
            {/* Main content */}
            <div className="md:col-span-4 space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList>
                  <TabsTrigger value="basic">Basic details</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                </TabsList>
                <TabsContent value="basic">
                  <BasicDetails form={form} />
                </TabsContent>
                <TabsContent value="media">
                  <Media form={form} />
                </TabsContent>
                <TabsContent value="pricing">
                  <Pricing form={form} />
                </TabsContent>
                <TabsContent value="inventory">
                  <Inventory form={form} />
                </TabsContent>
                <TabsContent value="shipping">
                  <Shipping form={form} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-2">
              <Organization form={form} />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}