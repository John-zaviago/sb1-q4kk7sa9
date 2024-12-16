import { useNavigate, useParams } from 'react-router-dom';
import { StoreLayout } from '../components/store-layout';
import { CheckoutForm } from '../components/checkout-form';
import { useCart } from '../context/cart-context';
import { StoreService } from '../services/store-service';
import { toast } from 'sonner';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { storeName } = useParams<{ storeName: string }>();
  const { state, clearCart } = useCart();

  const handleSubmit = async (data: any) => {
    try {
      if (!storeName) throw new Error('Store not found');
      
      await StoreService.placeOrder({
        storeName,
        customer: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: {
            address1: data.address1,
            address2: data.address2,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            country: data.country,
          },
        },
        items: state.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity,
        })),
        subtotal: state.total,
        total: state.total, // We'll add shipping and tax calculation later
      });

      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/store/${storeName}`);
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (state.items.length === 0) {
    return (
      <StoreLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Your cart is empty</h1>
            <p className="mt-2 text-muted-foreground">
              Add some products to your cart to checkout
            </p>
          </div>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>
        <CheckoutForm onSubmit={handleSubmit} />
      </div>
    </StoreLayout>
  );
}