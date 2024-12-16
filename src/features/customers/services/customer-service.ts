import { supabase } from '@/lib/supabase';
import { Customer, CustomerAddress } from '@/types/customer';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/auth/auth-store';

export class CustomerService {
  static async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const user = useAuthStore.getState().user;
      if (!user?.storeName) throw new Error('Store not found');

      const { count, error } = await supabase
        .from('customers')
        .select('email', { count: 'exact', head: true })
        .eq('store_name', user.storeName)
        .eq('email', email);

      if (error) throw error;
      return count === 0;
    } catch (error) {
      console.error('Failed to check email availability:', error);
      return false;
    }
  }

  static async getCustomers(): Promise<Customer[]> {
    try {
      const user = useAuthStore.getState().user;
      if (!user?.storeName) throw new Error('Store not found');

      const { data: customers, error } = await supabase
        .from('customers')
        .select(`
          *,
          customer_addresses (*)
        `)
        .eq('store_name', user.storeName)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return customers.map((customer) => ({
        id: customer.id,
        firstName: customer.first_name,
        lastName: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        acceptsMarketing: customer.accepts_marketing,
        tags: customer.tags || [],
        addresses: (customer.customer_addresses || []).map((address) => ({
          id: address.id,
          type: address.type,
          firstName: address.first_name,
          lastName: address.last_name,
          company: address.company,
          address1: address.address1,
          address2: address.address2,
          city: address.city,
          state: address.state,
          postalCode: address.postal_code,
          country: address.country,
          phone: address.phone,
          isDefault: address.is_default,
          createdAt: new Date(address.created_at),
          updatedAt: new Date(address.updated_at),
        })),
        createdAt: new Date(customer.created_at),
        updatedAt: new Date(customer.updated_at),
      }));
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      toast.error('Failed to load customers');
      return [];
    }
  }

  static async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    try {
      const user = useAuthStore.getState().user;
      if (!user?.storeName) throw new Error('Store not found');

      // Start a Supabase transaction
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          store_name: user.storeName,
          first_name: customer.firstName,
          last_name: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          accepts_marketing: customer.acceptsMarketing,
          tags: customer.tags,
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Insert addresses if any
      if (customer.addresses.length > 0) {
        const { error: addressError } = await supabase
          .from('customer_addresses')
          .insert(
            customer.addresses.map((address) => ({
              customer_id: newCustomer.id,
              store_name: user.storeName,
              type: address.type,
              first_name: address.firstName,
              last_name: address.lastName,
              company: address.company,
              address1: address.address1,
              address2: address.address2,
              city: address.city,
              state: address.state,
              postal_code: address.postalCode,
              country: address.country,
              phone: address.phone,
              is_default: address.isDefault,
            }))
          );

        if (addressError) throw addressError;
      }

      toast.success('Customer created successfully');
      return {
        ...customer,
        id: newCustomer.id,
        createdAt: new Date(newCustomer.created_at),
        updatedAt: new Date(newCustomer.updated_at),
      };
    } catch (error: any) {
      console.error('Failed to create customer:', error);
      
      // Handle specific error cases
      if (error.code === '23505') {
        toast.error('A customer with this email already exists');
      } else {
        toast.error('Failed to create customer. Please try again.');
      }
      
      throw error;
    }
  }

  static async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    try {
      const user = useAuthStore.getState().user;
      if (!user?.storeName) throw new Error('Store not found');

      // Update main customer data
      const { data: updatedCustomer, error: customerError } = await supabase
        .from('customers')
        .update({
          first_name: customer.firstName,
          last_name: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          accepts_marketing: customer.acceptsMarketing,
          tags: customer.tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('store_name', user.storeName)
        .select()
        .single();

      if (customerError) throw customerError;

      // Update addresses if provided
      if (customer.addresses) {
        // Delete existing addresses
        const { error: deleteError } = await supabase
          .from('customer_addresses')
          .delete()
          .eq('customer_id', id);

        if (deleteError) throw deleteError;

        // Insert new addresses
        if (customer.addresses.length > 0) {
          const { error: addressError } = await supabase
            .from('customer_addresses')
            .insert(
              customer.addresses.map((address) => ({
                customer_id: id,
                store_name: user.storeName,
                type: address.type,
                first_name: address.firstName,
                last_name: address.lastName,
                company: address.company,
                address1: address.address1,
                address2: address.address2,
                city: address.city,
                state: address.state,
                postal_code: address.postalCode,
                country: address.country,
                phone: address.phone,
                is_default: address.isDefault,
              }))
            );

          if (addressError) throw addressError;
        }
      }

      toast.success('Customer updated successfully');
      return {
        ...customer,
        id,
        createdAt: new Date(updatedCustomer.created_at),
        updatedAt: new Date(updatedCustomer.updated_at),
      } as Customer;
    } catch (error) {
      console.error('Failed to update customer:', error);
      toast.error('Failed to update customer');
      throw error;
    }
  }

  static async deleteCustomer(id: string): Promise<void> {
    try {
      const user = useAuthStore.getState().user;
      if (!user?.storeName) throw new Error('Store not found');

      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
        .eq('store_name', user.storeName);

      if (error) throw error;

      toast.success('Customer deleted successfully');
    } catch (error) {
      console.error('Failed to delete customer:', error);
      toast.error('Failed to delete customer');
      throw error;
    }
  }
}