import { useParams } from 'react-router-dom';
import { StoreLayout } from '../components/store-layout';
import { ProductGrid } from '../components/product-grid';
import { useStoreProducts } from '../hooks/use-store';

export function StorePage() {
  const { storeName } = useParams<{ storeName: string }>();
  const { data: products = [], isLoading } = useStoreProducts(storeName!);

  return (
    <StoreLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{storeName}</h1>
        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </StoreLayout>
  );
}