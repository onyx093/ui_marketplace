"use client";

import { Button } from "@/components/ui/button";
import { getProductLabel } from "@/config";
import { useCart } from "@/hooks/useCart";
import { cn, formatPrice } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CartPage = () => {
  const { items, removeItem } = useCart();

  const [isMounted, setIsMounted] = useState<boolean>(false);

  const router = useRouter();

  const { mutate: createCheckoutSession, isLoading } =
    trpc.payment.createSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) {
          router.push(url);
        }
      },
    });

  const productIds = items.map(({ product }) => product.id);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartTotal = items.reduce(
    (total, { product }) => total + product.price,
    0
  );

  const fee = 1;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div
            className={cn("lg:col-span-7", {
              "rounded-lg border-2 border-dashed border-zinc-200 p-12":
                isMounted && items.length === 0,
            })}
          >
            <h2 className="sr-only">Items in your shopping cart</h2>
            {isMounted && items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center space-y-1">
                <div
                  aria-hidden="true"
                  className="relative w-40 h-40 mb-4 text-muted-foreground"
                >
                  <Image
                    src="/ui-marketplace-empty-cart.png"
                    loading="eager"
                    fill
                    alt="empty shopping cart uimarketplace"
                  />
                </div>
                <h3 className="text-2xl font-semibold">Your cart is empty</h3>
                <p className="text-muted-foreground text-center">
                  Whoops! Nothing to show here yet.
                </p>
              </div>
            ) : null}

            <ul
              className={cn({
                "divide-y divide-gray-200 border-t border-b border-gray-200":
                  isMounted && items.length > 0,
              })}
            >
              {isMounted &&
                items.map(({ product }) => {
                  const productLabel = getProductLabel(product);
                  const { image } = product.images[0];
                  return (
                    <li key={product.id} className="flex py-6 sm:py-10">
                      <div className="flex-shrink-0">
                        <div className="relative w-24 h-24">
                          {typeof image !== "string" && image.url ? (
                            <Image
                              className="w-full h-full rounded-md object-cover object-center sm:w-48 sm:h-48"
                              src={image.url}
                              fill
                              alt="product image"
                            />
                          ) : null}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col justify-between ml-4 sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm">
                                <Link
                                  className="font-medium text-gray-700 hover:text-gray-800"
                                  href={`/products/${product.id}`}
                                >
                                  {product.name}
                                </Link>
                              </h3>
                            </div>

                            <div className="flex text-sm mt-1">
                              <p className="text-muted-foreground">
                                Category: {productLabel}
                              </p>
                            </div>

                            <p className="text-sm font-medium text-gray-900 mt-1">
                              {formatPrice(product.price)}
                            </p>
                          </div>

                          <div className="w-20 mt-4 sm:mt-0 sm:pr-9">
                            <div className="absolute top-0 right-0">
                              <Button
                                aria-label="remove product"
                                onClick={() => removeItem(product.id)}
                                variant="ghost"
                              >
                                <X aria-hidden="true" className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <p className="flex space-x-2 mt-4 text-sm text-gray-700">
                          <Check className="w-5 h-5 flex-shrink-0 text-green-500" />

                          <span>Eligible for instant delivery</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>

          <section className="bg-gray-50 rounded-lg py-6 px-4 mt-16 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm text-gray-900 font-medium">
                  {isMounted ? (
                    formatPrice(cartTotal)
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Flat Transaction Fee</span>
                </div>
                <div className="text-sm text-gray-900 font-medium">
                  {isMounted ? (
                    formatPrice(fee)
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-base text-gray-900 font-medium">
                  Order Total
                </div>
                <div className="text-base text-gray-900 font-medium">
                  {isMounted ? (
                    formatPrice(cartTotal + fee)
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                disabled={items.length === 0 || isLoading}
                onClick={() => createCheckoutSession({ productIds })}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                ) : null}
                Checkout
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
