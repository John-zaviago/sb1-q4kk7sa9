import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrderService } from '../services/order-service';
import { Order } from '@/types/order';

export function useOrders() {
  const queryClient = useQueryClient();

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: OrderService.getOrders,
  });

  const createOrder = useMutation({
    mutationFn: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) =>
      OrderService.createOrder(order, queryClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateOrder = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Order> }) =>
      OrderService.updateOrder(id, data, queryClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteOrder = useMutation({
    mutationFn: (id: string) => OrderService.deleteOrder(id, queryClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    orders,
    isLoading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
  };
}