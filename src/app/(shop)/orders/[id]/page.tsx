import { getOrderById } from "@/actions/order/get-order-by-id";
import { Title } from "@/components";
import OrderStatus from "@/components/orders/OrderStatus";
import PaypalButton from "@/components/paypal/PaypalButton";
import { currencyFormat } from "@/utils";
import Image from "next/image";
import { redirect } from "next/navigation";

interface Props {
  params: { id: string };
}

export default async function OrdersIdPage({ params }: Props) {
  const { id } = params;
  const { order, ok } = await getOrderById(id);

  // Todo: verifications
  if (!ok) redirect("/");

  const address = order!.OrderAddress!;

  return (
    <div className=" flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Order ${id}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Cart */}
          <div className="flex flex-col mt-5">
            <OrderStatus isPaid={order?.isPaid ?? false} />

            {/* Items */}
            {order!.OrderItem.map((item) => (
              <div
                key={item.product.slug + "-" + item.size}
                className="flex mb-5"
              >
                <Image
                  src={`/products/${item.product.ProductImage[0].url}`}
                  width={100}
                  height={100}
                  alt={item.product.title}
                  className="mr-5 rounded"
                  style={{
                    width: "100px",
                    height: "100px",
                  }}
                />

                <div>
                  <p>{item.product.title}</p>
                  <p>${item.price.toFixed(2)}</p>
                  <p>Subtotal: {currencyFormat(item.price * item.quantity)}</p>
                  {/* <QuantitySelector quantity={3} /> */}

                  <button className="underline mt-3">Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout - Resumen de orden */}
          <div className=" bg-white rounded-xl shadow-xl p-7">
            <h2 className=" text-2xl mb-2 font-bold">Delivery address</h2>
            <div className=" mb-10">
              <p className="text-xl">
                {address.firstName} {address.lastName}
              </p>
              <p>{address.address}</p>
              <p>{address.address2}</p>
              <p>{address.postalCode}</p>
              <p>
                {address.city}, {address.countryId}
              </p>
              <p>{address.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

            <h2 className=" text-2xl mb-2">Orden resume</h2>

            <div className="grid grid-cols-2">
              <span>Number of products</span>
              <span className="text-right">{order!.itemsInOrder} articles</span>

              <span>Subtotal</span>
              <span className="text-right">
                {currencyFormat(order!.subTotal)}
              </span>

              <span>Taxes (15%)</span>
              <span className="text-right">{currencyFormat(order!.tax)}</span>

              <span className="mt-5 text-2xl">Total</span>
              <span className="mt-5 text-2xl text-right">
                {currencyFormat(order!.total)}
              </span>
            </div>
            <div className=" mt-5 mb2 w-full">
              {order?.isPaid ? (
                <OrderStatus isPaid={order.isPaid ?? false} />
              ) : (
                <PaypalButton amount={order!.total} orderId={order!.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
