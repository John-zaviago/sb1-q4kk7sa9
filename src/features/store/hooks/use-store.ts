import { useQuery } from '@tanstack/react-query';
import { StoreService } from '../services/store-service';

export function useStoreProducts(storeName: string) {
  return useQuery({
    queryKey: ['store', storeName, 'products'],
    queryFn: () => StoreService.getStoreProducts(storeName),
  });
}

export function useProduct(storeName: string, productId: string) {
  return useQuery({
    queryKey: ['store', storeName, 'products', productId],
    queryFn: () => StoreService.getProduct(storeName, productId),
  });
}