import AddToCartButton from "@/components/AddToCartButton";
import ImageSlider from "@/components/ImageSlider";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";
import { getProductLabel } from "@/config";
import { getPayloadClient } from "@/get-payload";
import { formatPrice, getValidURLSForProduct } from "@/lib/utils";
import { Product } from "@/payload-types";
import { Check, Shield } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    productId: string;
  };
}

const BREADCRUMBS = [
  { id: 1, name: "Home", href: "/" },
  { id: 1, name: "Products", href: "/products" },
];

const ProductPage = async ({ params }: PageProps) => {
  const { productId } = params;
  const payload = await getPayloadClient();
  const { docs: products } = await payload.find({
    collection: "products",
    limit: 1,
    where: {
      id: {
        equals: productId,
      },
      approvedForSale: {
        equals: "approved",
      },
    },
  });

  const [product] = products;

  if (!product) {
    return notFound();
  }

  const productLabel = getProductLabel(product);
  const validUrls = getValidURLSForProduct(product);

  return (
    <MaxWidthWrapper className="bg-white">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 sm:py-24 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product Details */}
        <div className="lg:max-w-lg lg:self-end">
          <ol className="flex items-center space-x-2">
            {BREADCRUMBS.map((breadcrumb, i) => (
              <li key={breadcrumb.href}>
                <div className="flex items-center text-sm">
                  <Link
                    href={breadcrumb.href}
                    className="text-muted-foreground hover:text-gray-900 text-sm font-medium"
                  >
                    {breadcrumb.name}
                  </Link>

                  {i !== BREADCRUMBS.length - 1 ? (
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-4">
            <h1 className="text-3xl sm:text-4xl text-gray-900 font-bold tracking-tight">
              {product.name}
            </h1>
          </div>

          <section className="mt-4">
            <div className="flex items-center">
              <p className="text-gray-900 font-medium">
                {formatPrice(product.price)}
              </p>

              <div className="border-l text-muted-foreground border-gray-300 pl-4 ml-4">
                {productLabel}
              </div>
            </div>

            <div className="mt-4 space-y-6">
              <div className="text-base text-muted-foreground">
                {product.description}
              </div>
            </div>

            <div className="flex items-center mt-6">
              <Check
                className="w-5 h-5 flex-shrink-0 text-green-500"
                aria-hidden="true"
              />
              <p className="text-sm text-muted-foreground ml-2">
                Eligible for instant delivery
              </p>
            </div>
          </section>
        </div>

        {/* Product images */}
        <div className="mt-10 lg:col-start-2 lg:row-start-2 lg:mt-0 lg:self-center">
          <div className="aspect-square rounded-lg">
            <ImageSlider urls={validUrls} />
          </div>
        </div>

        <div className="lg:max-w-lg mt-10 lg:col-start-1 lg:row-span-2 lg:self-start">
          <div>
            <div className="mt-10">
              <AddToCartButton product={product} />
            </div>
            <div className="mt-6 text-center">
              <div className="group inline-flex text-sm font-medium">
                <Shield
                  aria-hidden="true"
                  className="w-5 h-5 flex-shrink-0 text-gray-400 mr-2"
                />
                <p className="text-muted-foreground text-gray-400">
                  30 days Return Guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductReel
        title={`Similar ${productLabel}`}
        subtitle={`Buy similar high-quality ${productLabel} just like '${product.name}'`}
        href="/products"
        query={{ category: product.category, limit: 4 }}
      />
    </MaxWidthWrapper>
  );
};

export default ProductPage;
