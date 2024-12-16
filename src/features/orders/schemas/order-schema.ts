import { z } from 'zod';

export const OrderItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string(),
  name: z.string(),
  price: z.number().min(0),
  quantity: z.number().min(1),
  total: z.number().min(0),
});

export const OrderSchema = z.object({
  id: z.string().optional(),
  customerId: z.string().optional(),
  customerName: z.string().optional(),
  customerEmail: z.string().optional(),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  items: z.array(OrderItemSchema),
  subtotal: z.number().min(0),
  discount: z.number().min(0),
  shipping: z.number().min(0),
  tax: z.number().min(0),
  total: z.number().min(0),
  notes: z.string().optional(),
  tags: z.array(z.string()),
});