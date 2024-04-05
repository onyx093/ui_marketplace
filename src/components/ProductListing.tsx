"use client";

import { Product } from "@/payload-types";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { cn, formatPrice, getValidURLSForProduct } from "@/lib/utils";
import { getProductLabel } from "@/config";
import ImageSlider from "./ImageSlider";

interface ProductListingProps {
  product: Product | null;
  index: number;
}

const ProductListing = ({ product, index }: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    return () => {
      clearTimeout(timer);
    };
  }, [index]);

  if (!product || !isVisible) {
    return <ProductPlaceholder />;
  }

  const productLabel = getProductLabel(product);

  const validUrls = getValidURLSForProduct(product)

  if (isVisible && product) {
    return (
      <Link
        className={cn("w-full h-full invisible cursor-pointer group/main", {
          "visible animate-in fade-in-5": isVisible,
        })}
        href={`/products/${product.id}`}
      >
        <div className="w-full flex flex-col">
          <ImageSlider urls={validUrls} />
          <h3 className="text-sm text-gray-700 font-medium mt-4">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{productLabel}</p>
          <p className="text-sm text-gray-900 font-medium mt-1">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    );
  }
};

const ProductPlaceholder = () => {
  return (
    <div className="w-full flex flex-col">
      <div className="relative w-full aspect-square bg-zinc-100 overflow-hidden rounded-xl">
        <Skeleton className="w-full h-full" />
      </div>
      <Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-16 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-12 h-4 rounded-lg" />
    </div>
  );
};

export default ProductListing;
