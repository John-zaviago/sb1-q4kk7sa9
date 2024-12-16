export interface User {
  id: string;
  fullName: string;
  email: string;
  storeName: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  orders: Order[];
  createdAt: Date;
}

export interface Order {
  id: string;
  customerId: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}