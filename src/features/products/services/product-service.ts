import { supabase } from '@/lib/supabase';
import { Product, ProductImage, ProductTag } from '@/types/product';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/auth/auth-store';

export class ProductService {
  static async getProducts(): Promise<Product[]> {
    try {
      const user = useAuthStore.getState().user;
      if (!user?.storeName) throw new Error('Store not found');

      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (*),
          product_tags (*)
        `)
        .eq('store_name', user.storeName)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch products:', error);
        throw error;
      }

      return products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        images: (product.product_images || []) as ProductImage[],
        category: {
          id: product.category_id,
          name: product.category_name,
          slug: product.category_id,
        },
        price: Number(product.price),
        compareAtPrice: product.compare_at_price ? Number(product.compare_at_price) : undefined,
        cost: product.cost ? Number(product.cost) : undefined,
        sku: product.sku,
        barcode: product.barcode,
        trackQuantity: product.track_quantity,
        quantity: product.quantity,
        weight: Number(product.weight),
        weightUnit: product.weight_unit,
        tags: (product.product_tags || []) as ProductTag[],
        status: product.status,
        createdAt: new Date(product.created_at),
        updatedAt: new Date(product.updated_at),
      }));
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
      return [];
    }
  }

  static async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const user = useAuthStore.getState().user;
      if (!user?.storeName) throw new Error('Store not found');

      // Insert the main product
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert({
          store_name: user.storeName,
          name: product.name,
          description: product.description,
          category_id: product.category?.id,
          category_name: product.category?.name,
          price: product.price,
          compare_at_price: product.compareAtPrice,
          cost: product.cost,
          sku: product.sku,
          barcode: product.barcode,
          track_quantity: product.trackQuantity,
          quantity: product.quantity,
          weight: product.weight,
          weight_unit: product.weightUnit,
          status: product.status,
        })
        .select()
        .single();

      if (productError) throw productError;

      // Insert images if any
      if (product.images.length > 0) {
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(
            product.images.map((image) => ({
              product_id: newProduct.id,
              url: image.url,
              alt: image.alt,
              position: image.position,
            }))
          );

        if (imagesError) throw imagesError;
      }

      // Insert tags if any
      if (product.tags.length > 0) {
        const { error: tagsError } = await supabase
          .from('product_tags')
          .insert(
            product.tags.map((tag) => ({
              product_id: newProduct.id,
              name: tag.name,
            }))
          );

        if (tagsError) throw tagsError;
      }

      toast.success('Product created successfully');
      return {
        ...product,
        id: newProduct.id,
        createdAt: new Date(newProduct.created_at),
        updatedAt: new Date(newProduct.updated_at),
      };
    } catch (error) {
      console.error('Failed to create product:', error);
      toast.error('Failed to create product');
      throw error;
    }
  }

  static async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    try {
      const user = useAuthStore.getState().user;
      if (!user?.storeName) throw new Error('Store not found');

      // Update the main product
      const { data: updatedProduct, error: productError } = await supabase
        .from('products')
        .update({
          name: product.name,
          description: product.description,
          category_id: product.category?.id,
          category_name: product.category?.name,
          price: product.price,
          compare_at_price: product.compareAtPrice,
          cost: product.cost,
          sku: product.sku,
          barcode: product.barcode,
          track_quantity: product.trackQuantity,
          quantity: product.quantity,
          weight: product.weight,
          weight_unit: product.weightUnit,
          status: product.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('store_name', user.storeName)
        .select()
        .single();

      if (productError) throw productError;

      // Update images if provided
      if (product.images) {
        // Delete existing images
        const { error: deleteImagesError } = await supabase
          .from('product_images')
          .delete()
          .eq('product_id', id);

        if (deleteImagesError) throw deleteImagesError;

        // Insert new images
        if (product.images.length > 0) {
          const { error: imagesError } = await supabase
            .from('product_images')
            .insert(
              product.images.map((image) => ({
                product_id: id,
                url: image.url,
                alt: image.alt,
                position: image.position,
              }))
            );

          if (imagesError) throw imagesError;
        }
      }

      // Update tags if provided
      if (product.tags) {
        // Delete existing tags
        const { error: deleteTagsError } = await supabase
          .from('product_tags')
          .delete()
          .eq('product_id', id);

        if (deleteTagsError) throw deleteTagsError;

        // Insert new tags
        if (product.tags.length > 0) {
          const { error: tagsError } = await supabase
            .from('product_tags')
            .insert(
              product.tags.map((tag) => ({
                product_id: id,
                name: tag.name,
              }))
            );

          if (tagsError) throw tagsError;
        }
      }

      toast.success('Product updated successfully');
      return {
        ...product,
        id,
        createdAt: new Date(updatedProduct.created_at),
        updatedAt: new Date(updatedProduct.updated_at),
      } as Product;
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product');
      throw error;
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    try {
      const user = useAuthStore.getState().user;
      if (!user?.storeName) throw new Error('Store not found');

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('store_name', user.storeName);

      if (error) throw error;

      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
      throw error;
    }
  }
}