import { useNavigate } from 'react-router-dom';
import { OrderForm } from '../components/order-form';
import { Order } from '@/types/order';
import { useOrders } from '../hooks/use-orders';

export function NewOrderPage() {
  const navigate = useNavigate();
  const { createOrder } = useOrders();

  const handleSubmit = async (data: Order) => {
    try {
      await createOrder.mutateAsync(data);
      navigate('/dashboard/orders');
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  return <OrderForm onSubmit={handleSubmit} />;
}