import { QuantitySelector, Title } from "@/components";
import { initialData } from "@/seed/seed";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { IoCardOutline } from "react-icons/io5";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

interface Props {
  params: { id: string };
}

export default function OrdersIdPage({ params }: Props) {
  const { id } = params;

  // Todo: verifications

  return (
    <div className=" flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Order ${id}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Cart */}
          <div className="flex flex-col mt-5">
            <div
              className={`${clsx(
                "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                {
                  "bg-red-500": false,
                  "bg-green-700": true,
                }
              )}`}
            >
              <IoCardOutline size={30} />
              <span className=" mx-2">Pending</span>
            </div>

            {/* Items */}
            {productsInCart.map((product) => (
              <div key={product.slug} className="flex mb-5">
                <Image
                  src={`/products/${product.images[0]}`}
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
                  <p>{product.title}</p>
                  <p>${product.price.toFixed(2)}</p>
                  <p>Subtotal: ${product.price * 3}</p>
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
              <p className="text-xl">Alejo Arroyave</p>
              <p>Carrera 123</p>
              <p>Medellín</p>
              <p>Antioquia</p>
              <p>Colombia</p>
              <p>CC1001123345</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

            <h2 className=" text-2xl mb-2">Orden resume</h2>

            <div className="grid grid-cols-2">
              <span>Number of products</span>
              <span className="text-right">3 articles</span>

              <span>Subtotal</span>
              <span className="text-right">$100</span>

              <span>Impuestos (15%)</span>
              <span className="text-right">$100</span>

              <span className="mt-5 text-2xl">Total</span>
              <span className="mt-5 text-2xl text-right">$100</span>
            </div>

            <div className=" mt-5 mb2 w-full">
              <div
                className={`${clsx(
                  "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                  {
                    "bg-red-500": false,
                    "bg-green-700": true,
                  }
                )}`}
              >
                <IoCardOutline size={30} />
                <span className=" mx-2">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
