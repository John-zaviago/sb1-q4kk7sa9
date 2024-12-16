import { supabase } from '@/lib/supabase';
import { StoreOrderCustomer } from '../types/store-order';

interface CreateCustomerParams {
  storeName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface CreateAddressParams extends StoreOrderCustomer {
  customerId: string;
  storeName: string;
}

export class CustomerService {
  static async createOrGetCustomer(params: CreateCustomerParams) {
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert({
        store_name: params.storeName,
        first_name: params.firstName,
        last_name: params.lastName,
        email: params.email,
        phone: params.phone,
      })
      .select()
      .single();

    if (customerError) {
      // If customer already exists, try to fetch them
      if (customerError.code === '23505') {
        const { data: existingCustomer, error: fetchError } = await supabase
          .from('customers')
          .select()
          .eq('store_name', params.storeName)
          .eq('email', params.email)
          .single();

        if (fetchError) throw fetchError;
        if (!existingCustomer) throw new Error('Failed to find customer');
        
        return existingCustomer;
      }
      throw customerError;
    }

    return customer;
  }

  static async createCustomerAddress(params: CreateAddressParams) {
    const { error: addressError } = await supabase
      .from('customer_addresses')
      .insert({
        customer_id: params.customerId,
        store_name: params.storeName,
        type: 'shipping',
        first_name: params.firstName,
        last_name: params.lastName,
        address1: params.address.address1,
        address2: params.address.address2,
        city: params.address.city,
        state: params.address.state,
        postal_code: params.address.postalCode,
        country: params.address.country,
        phone: params.phone,
        is_default: true,
      });

    if (addressError) throw addressError;
  }
}