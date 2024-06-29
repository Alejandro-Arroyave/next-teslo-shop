"use server";

import prisma from "@/lib/prisma";

export const setTransactionId = async (
  transactionId: string,
  orderId: string
) => {
  try {
    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        transactionId,
      },
    });

    if (!order) {
      return {
        ok: false,
        message: `Order with id ${orderId} not found`,
      };
    }

    return {
      ok: true,
    };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Cannot save paypal transaction id" };
  }
};
