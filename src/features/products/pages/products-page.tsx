import { ProductList } from '../components/product-list';
import { useProducts } from '../hooks/use-products';

export function ProductsPage() {
  const { products, isLoading } = useProducts();

  return <ProductList products={products} isLoading={isLoading} />;
}