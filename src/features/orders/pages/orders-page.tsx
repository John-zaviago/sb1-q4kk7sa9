import { OrderList } from '../components/order-list';
import { useOrders } from '../hooks/use-orders';

export function OrdersPage() {
  const { orders, isLoading } = useOrders();

  return <OrderList orders={orders} isLoading={isLoading} />;
}