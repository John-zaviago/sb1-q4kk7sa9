import { supabase } from '@/lib/supabase';
import { OrderItem } from '@/types/order';
import { Product } from '@/types/product';

export class OrderItemService {
  static async validateAndGetProducts(items: OrderItem[]): Promise<Product[]> {
    const productIds = items.map(item => item.productId);
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds)
      .eq('status', 'active');

    if (error) throw error;
    if (!products) throw new Error('Products not found');

    // Validate all products exist and have sufficient stock
    items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found or is no longer active`);
      }
      
      if (product.track_quantity && (product.quantity || 0) < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }
    });

    return products;
  }

  static async updateProductStock(items: OrderItem[]): Promise<void> {
    for (const item of items) {
      const { error } = await supabase.rpc('update_product_stock', {
        p_product_id: item.productId,
        p_quantity: item.quantity
      });
      
      if (error) throw error;
    }
  }
}