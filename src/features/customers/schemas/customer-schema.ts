import { z } from 'zod';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const CustomerAddressSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['billing', 'shipping']),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  address1: z.string().min(1, 'Address is required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number').optional(),
  isDefault: z.boolean(),
});

export const CustomerSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number').optional(),
  acceptsMarketing: z.boolean(),
  tags: z.array(z.string()),
  addresses: z.array(CustomerAddressSchema),
});