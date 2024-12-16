import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { transformProduct } from '../utils/product-transformer';
import { StoreOrder } from '../types/store-order';
import { StoreOrderService } from './store-order.service';

export class StoreService {
  static async getStoreProducts(storeName: string): Promise<Product[]> {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          compare_at_price,
          cost,
          sku,
          barcode,
          track_quantity,
          quantity,
          weight,
          weight_unit,
          status,
          category_id,
          category_name,
          created_at,
          updated_at,
          product_images (
            id,
            url,
            alt,
            position
          ),
          product_tags (
            id,
            name
          )
        `)
        .eq('store_name', storeName)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (products || []).map(transformProduct);
    } catch (error) {
      console.error('Failed to fetch store products:', error);
      toast.error('Failed to load products');
      return [];
    }
  }

  static async getProduct(storeName: string, productId: string): Promise<Product | null> {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          compare_at_price,
          cost,
          sku,
          barcode,
          track_quantity,
          quantity,
          weight,
          weight_unit,
          status,
          category_id,
          category_name,
          created_at,
          updated_at,
          product_images (
            id,
            url,
            alt,
            position
          ),
          product_tags (
            id,
            name
          )
        `)
        .eq('store_name', storeName)
        .eq('id', productId)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      if (!product) return null;

      return transformProduct(product);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product');
      return null;
    }
  }

  static placeOrder = StoreOrderService.placeOrder;
}