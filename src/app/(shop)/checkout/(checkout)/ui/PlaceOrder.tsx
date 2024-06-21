"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat, sleep } from "@/utils";
import clsx from "clsx";
import { placeOrder } from "@/actions";
import { useRouter } from "next/navigation";

const PlaceOrder = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const address = useAddressStore((state) => state.address);
  const summaryInformation = useCartStore((state) =>
    state.getSummaryInformation()
  );
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const { itemsInCart, subTotal, tax, total } = summaryInformation;

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);
    // await sleep(2);

    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    // Server action
    const resp = await placeOrder(productsToOrder, address);
    if (!resp.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(resp.message);
      return;
    }

    clearCart();
    router.replace(`/orders/${resp.order?.id}`);
  };

  if (!loaded) return <p>Loading...</p>;

  return (
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
          {address.city}, {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

      <h2 className=" text-2xl mb-2">Orden resume</h2>

      <div className="grid grid-cols-2">
        <span>Number of products</span>
        <span className="text-right">{itemsInCart} articles</span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>

        <span>Taxes (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="mt-5 text-2xl">Total</span>
        <span className="mt-5 text-2xl text-right">
          {currencyFormat(total)}
        </span>
      </div>

      <div className=" mt-5 mb2 w-full">
        {/* Disclaimer */}
        <p className="mb-5">
          <span>
            By clicking &quot;Make order&ldquo; button, you are accepting our{" "}
            <a className="underline">terms and conditions</a> and{" "}
            <a className="underline">privacy statement</a>
          </span>
        </p>

        <p className=" text-red-500">{errorMessage}</p>
        <button
          // href={"/orders/123"}
          className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder,
          })}
          onClick={onPlaceOrder}
          disabled={isPlacingOrder}
        >
          Make order
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;
