import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      alt: z.string(),
      position: z.number(),
    })
  ),
  category: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  }).optional(),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  compareAtPrice: z.number().optional(),
  cost: z.number().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  trackQuantity: z.boolean(),
  quantity: z.number().optional(),
  weight: z.number().min(0, 'Weight must be greater than or equal to 0'),
  weightUnit: z.enum(['kg', 'lb']),
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  status: z.enum(['draft', 'active', 'archived']),
});