"use server";

import prisma from "@/lib/prisma";
// import { sleep } from "@/utils";

export const getStockBySlug = async (slug: string): Promise<number> => {
  try {
    // await sleep(3);
    const productSlug = await prisma.product.findFirst({
      where: {
        slug,
      },
      select: {
        inStock: true,
      },
    });

    console.log(productSlug);

    return productSlug?.inStock ?? 0;
  } catch (error) {
    return 0;
  }
};
