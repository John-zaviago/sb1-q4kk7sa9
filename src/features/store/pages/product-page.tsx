import { useParams } from 'react-router-dom';
import { StoreLayout } from '../components/store-layout';
import { ProductDetails } from '../components/product-details';
import { useProduct } from '../hooks/use-store';

export function ProductPage() {
  const { storeName, productId } = useParams<{ storeName: string; productId: string }>();
  const { data: product, isLoading } = useProduct(storeName!, productId!);

  if (isLoading) {
    return (
      <StoreLayout>
        <div>Loading...</div>
      </StoreLayout>
    );
  }

  if (!product) {
    return (
      <StoreLayout>
        <div>Product not found</div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <ProductDetails product={product} />
    </StoreLayout>
  );
}