import { UseFormReturn } from 'react-hook-form';
import { ImagePlus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';

interface MediaProps {
  form: UseFormReturn<Product>;
}

export function Media({ form }: MediaProps) {
  const images = form.watch('images') || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {/* Upload area */}
        <div className="relative col-span-4 h-48 rounded-lg border-2 border-dashed border-muted-foreground/25">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium">Drop your images here</p>
            <p className="text-xs text-muted-foreground">
              or click to browse files
            </p>
            <Button size="sm" variant="secondary">
              <ImagePlus className="mr-2 h-4 w-4" />
              Choose files
            </Button>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(e) => {
              // Handle file upload
            }}
          />
        </div>

        {/* Image previews */}
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative aspect-square rounded-lg border bg-muted"
          >
            <img
              src={image.url}
              alt={image.alt}
              className="absolute inset-0 h-full w-full rounded-lg object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}