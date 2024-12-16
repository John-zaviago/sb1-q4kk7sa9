import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerSchema } from '../../schemas/customer-schema';
import { BasicDetails } from './sections/basic-details';
import { Addresses } from './sections/addresses';
import { Marketing } from './sections/marketing';
import { Customer } from '@/types/customer';

interface CustomerFormProps {
  initialData?: Customer;
  onSubmit: (data: Customer) => Promise<void>;
}

export function CustomerForm({ initialData, onSubmit }: CustomerFormProps) {
  const form = useForm({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      acceptsMarketing: false,
      tags: [],
      addresses: [],
      ...initialData,
    },
  });

  const handleSubmit = async (data: Customer) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to save customer:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {initialData ? 'Edit customer' : 'Add customer'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {initialData
            ? 'Update customer details'
            : 'Add a new customer to your store'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="flex items-center gap-4">
            <Button type="submit">Save customer</Button>
            <Button type="button" variant="outline">
              Discard
            </Button>
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList>
              <TabsTrigger value="basic">Basic details</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              <BasicDetails form={form} />
            </TabsContent>
            <TabsContent value="addresses">
              <Addresses form={form} />
            </TabsContent>
            <TabsContent value="marketing">
              <Marketing form={form} />
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}