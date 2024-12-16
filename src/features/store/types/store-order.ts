export interface StoreOrderCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface StoreOrderItem {
  productId: string;
  quantity: number;
  price: number;
  total: number;
}

export interface StoreOrder {
  storeName: string;
  customer: StoreOrderCustomer;
  items: StoreOrderItem[];
  subtotal: number;
  total: number;
}