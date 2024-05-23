"use client";
import React, { useEffect, useState } from "react";
import { QuantitySelector } from "@/components";
import { useCartStore } from "@/store";
import Image from "next/image";
import Link from "next/link";

export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore((state) => state.cart);
  const updateProductsQuantity = useCartStore(
    (state) => state.updateProductQuantity
  );
  const removeProductFromCart = useCartStore(
    (state) => state.removeProductFromCart
  );

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <p>Loading...</p>;
  return (
    <>
      {productsInCart.map((product) => (
        <div key={product.slug + "-" + product.size} className="flex mb-5">
          <Image
            src={`/products/${product.image}`}
            width={100}
            height={100}
            alt={product.title}
            className="mr-5 rounded"
            style={{
              width: "100px",
              height: "100px",
            }}
          />

          <div>
            <Link
              href={`/product/${product.slug}`}
              className="hover:underline cursor-pointer"
            >
              {product.size} - {product.title}
            </Link>
            <p>${product.price.toFixed(2)}</p>
            <QuantitySelector
              quantity={product.quantity}
              onQuantityChange={(value) =>
                updateProductsQuantity(product, value)
              }
            />

            <button
              className="underline mt-3 hover:text-red-500"
              onClick={() => removeProductFromCart(product)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
