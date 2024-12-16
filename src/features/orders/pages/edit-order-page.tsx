import { useParams, useNavigate } from 'react-router-dom';
import { OrderForm } from '../components/order-form';
import { Order } from '@/types/order';
import { useOrders } from '../hooks/use-orders';

export function EditOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrder } = useOrders();
  
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return <div>Order not found</div>;
  }

  const handleSubmit = async (data: Order) => {
    try {
      await updateOrder.mutateAsync({ id, data });
      navigate('/dashboard/orders');
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  return <OrderForm initialData={order} onSubmit={handleSubmit} />;
}