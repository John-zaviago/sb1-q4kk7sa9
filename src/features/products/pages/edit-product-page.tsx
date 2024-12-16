import { useParams, useNavigate } from 'react-router-dom';
import { ProductForm } from '../components/product-form';
import { Product } from '@/types/product';
import { useProducts } from '../hooks/use-products';

export function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, updateProduct } = useProducts();
  
  const product = products.find((p) => p.id === id);

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleSubmit = async (data: Product) => {
    try {
      await updateProduct.mutateAsync({ id, data });
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  return <ProductForm initialData={product} onSubmit={handleSubmit} />;
}