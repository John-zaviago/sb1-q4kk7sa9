import { supabase } from '@/lib/supabase';
import { Order } from '@/types/order';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/auth/auth-store';
import { OrderItemService } from './order-item-service';

export class OrderService {
  static async getOrders(): Promise<Order[]> {
    try {
      const user = useAuthStore.getState().user;
      if (!user?.storeName) throw new Error('Store not found');

      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers (
            first_name,
            last_name,
            email
          ),
          order_items (
            id,
            product_id,
            quantity,
            price,
            total,
            products (
              name,
              status
            )
          )
        `)
        .eq('store_name', user.storeName)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return orders.map((order) => ({
        id: order.id,
        customerId: order.customer_id,
        customerName: order.customers
          ? `${order.customers.first_name} ${order.customers.last_name}`
          : undefined,
        customerEmail: order.customers?.email,
        status: order.status,
        items: (order.order_items || []).map((item) => ({
          id: item.id,
          productId: item.product_id,
          name: item.products?.status === 'active' 
            ? item.products.name 
            : 'Product no longer available',
          price: Number(item.price),
          quantity: item.quantity,
          total: Number(item.total),
        })),
        subtotal: Number(order.subtotal),
        discount: Number(order.discount),
        shipping: Number(order.shipping),
        tax: Number(order.tax),
        total: Number(order.total),
        notes: order.notes,
        tags: order.tags || [],
        createdAt: new Date(order.created_at),
        updatedAt: new Date(order.updated_at),
      }));
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
      return [];
    }
  }

  static async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    try {
      const user = useAuthStore.getState().user;
      if (!user?.storeName) throw new Error('Store not found');

      // Validate products and check stock
      await OrderItemService.validateAndGetProducts(order.items);

      // Create order using the stored procedure
      const { data: newOrder, error: orderError } = await supabase.rpc('create_order', {
        p_store_name: user.storeName,
        p_customer_id: order.customerId,
        p_status: order.status,
        p_subtotal: order.subtotal,
        p_discount: order.discount,
        p_shipping: order.shipping,
        p_tax: order.tax,
        p_total: order.total,
        p_notes: order.notes,
        p_tags: order.tags,
        p_items: order.items.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
          total: item.total
        }))
      });

      if (orderError) throw orderError;

      // Update product stock
      await OrderItemService.updateProductStock(order.items);

      toast.success('Order created successfully');
      return {
        ...order,
        id: newOrder.id,
        createdAt: new Date(newOrder.created_at),
        updatedAt: new Date(newOrder.updated_at),
      };
    } catch (error: any) {
      console.error('Failed to create order:', error);
      toast.error(error.message || 'Failed to create order');
      throw error;
    }
  }

  // ... rest of the service methods ...
}