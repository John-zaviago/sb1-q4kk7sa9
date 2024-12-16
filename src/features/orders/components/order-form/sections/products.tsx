import { UseFormReturn } from 'react-hook-form';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductSelect } from '../../product-select';
import { Order } from '@/types/order';
import { formatCurrency } from '@/lib/utils';

interface ProductsProps {
  form: UseFormReturn<Order>;
}

export function Products({ form }: ProductsProps) {
  const items = form.watch('items') || [];

  const handleProductSelect = (product: any) => {
    // Check if product already exists in items
    const existingItem = items.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Update quantity of existing item
      const updatedItems = items.map(item => {
        if (item.productId === product.id) {
          const newQuantity = item.quantity + 1;
          return {
            ...item,
            quantity: newQuantity,
            total: product.price * newQuantity
          };
        }
        return item;
      });
      form.setValue('items', updatedItems);
    } else {
      // Add new item
      const newItem = {
        id: crypto.randomUUID(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        total: product.price,
      };
      form.setValue('items', [...items, newItem]);
    }
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = items.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          quantity: newQuantity,
          total: item.price * newQuantity
        };
      }
      return item;
    });
    form.setValue('items', updatedItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Products</h3>
        <ProductSelect onSelect={handleProductSelect}>
          <Button type="button" variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add product
          </Button>
        </ProductSelect>
      </div>

      {/* Product list */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="flex-1">
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-muted-foreground">
                {formatCurrency(item.price)} per unit
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(index, item.quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <Input
                type="number"
                min="1"
                className="w-20 text-center"
                value={item.quantity}
                onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
              />
              
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(index, item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="w-24 text-right">
              {formatCurrency(item.total)}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const newItems = [...items];
                newItems.splice(index, 1);
                form.setValue('items', newItems);
              }}
            >
              Remove
            </Button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No products added yet
          </div>
        )}
      </div>
    </div>
  );
}