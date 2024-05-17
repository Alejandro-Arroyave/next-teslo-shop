export const revalidate = 60;

import { notFound, redirect } from "next/navigation";

import { Pagination, Title } from "@/components";
import ProductGrid from "@/components/products/product-grid/ProductGrid";
import { getPaginatedProductsWithImages } from "@/actions";
import { Gender } from "@prisma/client";

interface Props {
  params: { gender: string };
  searchParams: { page: string };
}

export default async function GenderPage({ params, searchParams }: Props) {
  const { gender } = params;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, currentPage, totalPages } =
    await getPaginatedProductsWithImages({
      page,
      gender: gender as Gender,
    });

  if (products.length === 0) redirect(`/gender/${gender}`);

  const labels: Record<string, string> = {
    men: "Men",
    women: "Women",
    kid: "Kids",
    unisex: "Unisex",
  };

  if (!["men", "women", "kid"].includes(gender)) return notFound();

  return (
    <>
      <Title
        title="Shop"
        subtitle={`${labels[gender]} products`}
        className="mb-2"
      />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  );
}
