"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderById = async (id: string) => {
  const session = await auth();
  if (!session?.user) {
    return {
      ok: false,
      message: "There is no authenticated user",
    };
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        id,
      },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,

            product: {
              select: {
                title: true,
                slug: true,
                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) throw `${id} does not exist`;

    if (session.user.role === "user") {
      if (session.user.id !== order.userId) {
        throw `${id} is not from this user`;
      }
    }

    return {
      ok: true,
      order,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      messag: "Order does not exist",
    };
  }
};
