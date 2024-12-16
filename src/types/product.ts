export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductTag {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: ProductImage[];
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  sku: string;
  barcode?: string;
  trackQuantity: boolean;
  quantity?: number;
  weight: number;
  weightUnit: 'kg' | 'lb';
  tags: ProductTag[];
  status: 'draft' | 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}