import { notFound } from "next/navigation";

import { Title } from "@/components";
import ProductGrid from "@/components/products/product-grid/ProductGrid";
import { initialData } from "@/seed/seed";
import { ValidCategory } from "@/interfaces";

interface Props {
  params: { id: ValidCategory };
}

export default function ({ params }: Props) {
  const { id } = params;

  const products = initialData.products.filter(
    (product) => product.gender === id
  );

  const labels: Record<ValidCategory, string> = {
    men: "Men",
    women: "Women",
    kid: "Kids",
    unisex: "Unisex",
  };

  if (!["men", "women", "kid"].includes(id)) return notFound();

  return (
    <>
      <Title
        title="Shop"
        subtitle={`${labels[id]} products`}
        className="mb-2"
      />
      <ProductGrid products={products} />
    </>
  );
}
