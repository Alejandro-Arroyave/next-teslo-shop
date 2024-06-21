"use server";

import { auth } from "@/auth.config";
import { Address, ValidSize } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductsToOrder {
  productId: string;
  quantity: number;
  size: ValidSize;
}

export const placeOrder = async (
  productIds: ProductsToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user.id;

  // Verify user session
  if (!userId) {
    return {
      ok: false,
      message: "There is no user session",
    };
  }

  // Get products info
  // Note: We can have 2 + products with same ID
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map((p) => p.productId),
      },
    },
  });

  // Calculate mounts in header

  const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

  const { subTotal, tax, total } = productIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = products.find((product) => product.id === item.productId);

      if (!product) throw new Error(`${item.productId} does not exist - 500`);

      const subTotal = product.price * productQuantity;
      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.15;
      totals.total += subTotal * 1.15;

      return totals;
    },
    { subTotal: 0, tax: 0, total: 0 }
  );

  // Create transaction
  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Update products stock
      const updatedProductsPromises = products.map((product) => {
        // Accumulate values
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => acc + item.quantity, 0);

        if (productQuantity === 0) {
          throw new Error(`${product.id} does not have a defined quantity`);
        }

        return tx.product.update({
          where: { id: product.id },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProduct = await Promise.all(updatedProductsPromises);

      // Verify negative values in DB = no stock
      updatedProduct.forEach((product) => {
        if (product.inStock < 0)
          throw new Error(`${product.id} does not have quantity enough`);
      });

      // 2. Create order - header - details
      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder,
          subTotal,
          tax,
          total,
          OrderItem: {
            createMany: {
              data: productIds.map((p) => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price:
                  products.find((prod) => prod.id === p.productId)?.price ?? 0,
              })),
            },
          },
        },
      });

      // Validate if price === 0, and throw an error

      // 3. Create order direction
      const { country, ...restAddress } = address;
      const orderAddress = await tx.orderAddress.create({
        data: {
          ...restAddress,
          orderId: order.id,
          countryId: country,
        },
      });

      return {
        order,
        orderAddress,
      };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    };
  }
};
