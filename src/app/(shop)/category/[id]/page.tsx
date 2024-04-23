import { notFound } from "next/navigation";

import { Title } from "@/components";
import ProductGrid from "@/components/products/product-grid/ProductGrid";
import { initialData } from "@/seed/seed";

interface Props {
  params: { id: string };
}

export default function ({ params }: Props) {
  const { id } = params;

  const products = initialData.products.filter(
    (product) => product.gender === id
  );

  if (!["men", "women", "kid"].includes(id)) return notFound();

  return (
    <>
      <Title title="Shop" subtitle={`${id} products`} className="mb-2" />
      <ProductGrid products={products} />
    </>
  );
}
