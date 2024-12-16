import { supabase } from '@/lib/supabase';
import { StoreOrder } from '../types/store-order';
import { CustomerService } from './store-customer.service';
import { toast } from 'sonner';

export class StoreOrderService {
  static async placeOrder(order: StoreOrder): Promise<void> {
    try {
      // Create or get existing customer
      const customer = await CustomerService.createOrGetCustomer({
        storeName: order.storeName,
        firstName: order.customer.firstName,
        lastName: order.customer.lastName,
        email: order.customer.email,
        phone: order.customer.phone,
      });

      // Create customer address
      await CustomerService.createCustomerAddress({
        customerId: customer.id,
        storeName: order.storeName,
        ...order.customer,
      });

      // Create the order using the stored procedure
      const { data: newOrder, error: orderError } = await supabase.rpc('place_order', {
        p_store_name: order.storeName,
        p_customer_id: customer.id,
        p_status: 'pending',
        p_subtotal: order.subtotal,
        p_discount: 0,
        p_shipping: 0,
        p_tax: 0,
        p_total: order.total,
        p_notes: '',
        p_tags: [],
        p_items: order.items
      });

      if (orderError) throw orderError;
      if (!newOrder?.[0]) throw new Error('Failed to create order');

      toast.success('Order placed successfully!');
    } catch (error: any) {
      console.error('Failed to place order:', error);
      toast.error(error.message || 'Failed to place order');
      throw error;
    }
  }
}