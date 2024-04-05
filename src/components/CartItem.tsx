import { getProductLabel } from "@/config";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/payload-types";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

const CartItem = ({ product }: { product: Product }) => {
  const { image } = product.images[0];
  const { removeItem } = useCart();

  const productLabel = getProductLabel(product);

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 relative aspect-square min-w-fit overflow-hidden rounded">
            {typeof image !== "string" && image.url ? (
              <Image
                src={image.url}
                fill
                alt={product.name}
                className="absolute object-cover"
              />
            ) : (
              <div className="bg-secondary h-full flex items-center justify-center">
                <ImageIcon
                  aria-hidden="true"
                  className="w-4 h-4 text-muted-foreground"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col self-start">
            <span className="line-clamp-1 text-sm font-medium mb-1">
              {product.name}
            </span>

            <span className="line-clamp-1 text-xs text-muted-foreground capitalize">
              {productLabel}
            </span>

            <div className="mt-4 text-xs text-muted-foreground">
              <button
                className="flex items-center gap-0.5"
                onClick={() => removeItem(product.id)}
              >
                <X className="w-3 h-4" />
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1 font-medium">
          <div className="ml-auto line-clamp-1 text-sm">
            {formatPrice(product.price)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
