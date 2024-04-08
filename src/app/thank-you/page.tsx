import PaymentStatus from "@/components/PaymentStatus";
import { getProductLabel } from "@/config";
import { getPayloadClient } from "@/get-payload";
import { getServerSideUser } from "@/lib/payload-utils";
import { formatPrice } from "@/lib/utils";
import { Product, ProductFile, User } from "@/payload-types";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const ThankYouPage = async ({ searchParams }: PageProps) => {
  const orderId = searchParams.orderId;
  const pageCookies = cookies();
  const { user } = await getServerSideUser(pageCookies);
  const payload = await getPayloadClient();
  const { docs: orders } = await payload.find({
    collection: "orders",
    depth: 2,
    where: {
      id: {
        equals: orderId,
      },
    },
  });

  const [order] = orders;
  if (!order) {
    return notFound();
  }

  const orderUserId =
    typeof order.user === "string" ? order.user : order.user.id;

  if (orderUserId !== user?.id) {
    return redirect(`/sign-in?origin=thank-you?orderId=${order.id}`);
  }

  const products = order.products as Product[];

  const orderTotal = products.reduce(
    (total, product) => total + product.price,
    0
  );

  return (
    <main className="relative lg:min-h-full">
      <div className="hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          fill
          src="/checkout-thank-you.jpg"
          alt="thank you for your order"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div>
        <div className="max-w-2xl lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-x-8 xl:gap-x-24 py-16 lg:py-32 px-4 sm:py-24 sm:px-6 lg:px-8 mx-auto">
          <div className="lg:col-start-2">
            <p className="text-sm text-blue-600 font-medium">
              Order successful
            </p>
            <h3 className="mt-2 text-4xl sm:text-5xl text-gray-900 tracking-tight font-bold">
              Thanks for ordering
            </h3>
            {order._isPaid ? (
              <p className="mt-2 text-base text-muted-foreground">
                Your order was processed and your assets are available for
                download below. We&apos;ve sent your receipt and order details{" "}
                {typeof order.user !== "string" ? (
                  <span className="text-gray-900 font-medium">
                    {order.user.email}
                  </span>
                ) : null}
              </p>
            ) : (
              <p className="mt-2 text-base text-muted-foreground">
                We appreciate your order, and we&apos;re currently processing
                it. So hand tight we&apos;ll sent you confirmation very soon.
              </p>
            )}

            <div className="mt-16 text-sm font-medium">
              <div className="text-muted-foreground">Order no.</div>
              <div className="mt-2 text-gray-900">{order.id}</div>

              <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
                {(order.products as Product[]).map((product) => {
                  const productLabel = getProductLabel(product);
                  const downloadURL = (product.product_files as ProductFile)
                    .url as string;
                  const { image } = product.images[0];
                  return (
                    <li key={product.id} className="flex py-6 space-x-6">
                      <div className="relative w-24 h-24">
                        {typeof image !== "string" && image.url ? (
                          <Image
                            className="flex-none rounded-md bg-gray-100 object-cover object-center"
                            fill
                            src={image.url}
                            alt={`${product.name} image`}
                          />
                        ) : null}
                      </div>

                      <div className="flex flex-auto flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="text-gray-900">{product.name}</h3>
                          <p className="my-1">Category: {productLabel}</p>
                        </div>

                        {order._isPaid ? (
                          <a
                            href={downloadURL}
                            download={product.name}
                            className="text-blue-600 hover:underline underline-offset-2"
                          >
                            Download asset
                          </a>
                        ) : null}
                      </div>

                      <p className="flex-none text-gray-900 font-medium">
                        {formatPrice(product.price)}
                      </p>
                    </li>
                  );
                })}
              </ul>
              <div className="space-y-6 border-t border-gray-200 pt-6 text-sm text-muted-foreground font-medium">
                <div className="flex justify-between">
                  <p>Subtotal:</p>
                  <p className="text-gray-900">{formatPrice(orderTotal)}</p>
                </div>

                <div className="flex justify-between">
                  <p>Transaction Fee:</p>
                  <p className="text-gray-900">{formatPrice(1)}</p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <p className="text-base">Total</p>
                  <p className="text-base">{formatPrice(orderTotal + 1)}</p>
                </div>
              </div>

              <PaymentStatus
                orderId={order.id}
                orderEmail={(order.user as User).email}
                isPaid={order._isPaid}
              />

              <div className="mt-16 border-t border-gray-200 py-6 text-right">
                <Link
                  href="/products"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Continue shopping &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankYouPage;
