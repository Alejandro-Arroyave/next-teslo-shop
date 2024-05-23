"use client";
import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import React, { useEffect, useState } from "react";

export const OrderSummary = () => {
  const [loaded, setLoaded] = useState(false);
  const summaryInformation = useCartStore((state) =>
    state.getSummaryInformation()
  );
  const { itemsInCart, subTotal, tax, total } = summaryInformation;

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-2">
      <span>Number of products</span>
      <span className="text-right">{itemsInCart} articles</span>

      <span>Subtotal</span>
      <span className="text-right">{currencyFormat(subTotal)}</span>

      <span>Taxes (15%)</span>
      <span className="text-right">{currencyFormat(tax)}</span>

      <span className="mt-5 text-2xl">Total</span>
      <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
    </div>
  );
};
