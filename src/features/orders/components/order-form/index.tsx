import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderSchema } from '../../schemas/order-schema';
import { BasicDetails } from './sections/basic-details';
import { Products } from './sections/products';
import { Summary } from './sections/summary';
import { Notes } from './sections/notes';
import { Order } from '@/types/order';

interface OrderFormProps {
  initialData?: Order;
  onSubmit: (data: Order) => Promise<void>;
}

export function OrderForm({ initialData, onSubmit }: OrderFormProps) {
  const form = useForm({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      customerId: '',
      status: 'pending',
      items: [],
      subtotal: 0,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      notes: '',
      tags: [],
      ...initialData,
    },
  });

  const handleSubmit = async (data: Order) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to save order:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {initialData ? 'Edit order' : 'Create order'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {initialData
            ? 'Update order details'
            : 'Create a new order for your store'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="flex items-center gap-4">
            <Button type="submit">Save order</Button>
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
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="basic">
                  <BasicDetails form={form} />
                </TabsContent>
                <TabsContent value="products">
                  <Products form={form} />
                </TabsContent>
                <TabsContent value="notes">
                  <Notes form={form} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-2">
              <Summary form={form} />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}