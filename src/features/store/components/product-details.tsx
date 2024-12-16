import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '../context/cart-context';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product images */}
        <div className="space-y-4">
          {product.images[0] ? (
            <div className="aspect-square rounded-lg border bg-muted overflow-hidden">
              <img
                src={product.images[0].url}
                alt={product.images[0].alt}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square rounded-lg border bg-secondary" />
          )}
          <div className="grid grid-cols-4 gap-4">
            {product.images.slice(1).map((image) => (
              <div
                key={image.id}
                className="aspect-square rounded-lg border bg-muted overflow-hidden"
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-2xl font-semibold">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="prose prose-sm">
            <p>{product.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleAddToCart}
              disabled={product.trackQuantity && (product.quantity || 0) < 1}
            >
              {product.trackQuantity && (product.quantity || 0) < 1
                ? 'Out of stock'
                : 'Add to cart'}
            </Button>
          </div>

          {/* Additional details */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Category</span>
              <span>{product.category?.name}</span>
            </div>
            {product.sku && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SKU</span>
                <span>{product.sku}</span>
              </div>
            )}
            {product.tags.length > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tags</span>
                <span>{product.tags.map((tag) => tag.name).join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}