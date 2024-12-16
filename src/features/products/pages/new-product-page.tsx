import { useNavigate } from 'react-router-dom';
import { ProductForm } from '../components/product-form';
import { Product } from '@/types/product';
import { useProducts } from '../hooks/use-products';

export function NewProductPage() {
  const navigate = useNavigate();
  const { createProduct } = useProducts();

  const handleSubmit = async (data: Product) => {
    try {
      await createProduct.mutateAsync(data);
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  return <ProductForm onSubmit={handleSubmit} />;
}