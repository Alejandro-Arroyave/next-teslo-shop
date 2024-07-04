"use server";

import { PaypalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const authToken = await getPaypalBearerToken();
  console.log({ authToken });

  if (!authToken) {
    return {
      ok: false,
      message: "Could not get access token",
    };
  }

  const resp = await verifyPaypalPayment(paypalTransactionId, authToken);

  if (!resp) {
    return {
      ok: false,
      message: "Error verifying payment",
    };
  }

  const { status, purchase_units } = resp;
  const { invoice_id: orderId } = purchase_units[0];

  if (status !== "COMPLETED") {
    return {
      ok: false,
      message: "Not paid in paypal yet",
    };
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });

    //Todo: revaldiar path
    revalidatePath(`/orders/${orderId}`);

    return { ok: true };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "500 - Payment could not be processed",
    };
  }
};

const getPaypalBearerToken = async () => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const PAYPAL_OAUTH_URL = process.env.PAYPAL_OAUTH_URL ?? "";
  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`
  ).toString("base64");

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Basic ${base64Token}`);
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const result = await fetch(PAYPAL_OAUTH_URL, {
      ...requestOptions,
      cache: "no-store",
      redirect: "follow",
    }).then((r) => r.json());

    return result.access_token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const verifyPaypalPayment = async (
  paypalTransactionId: string,
  bearerToken: string
): Promise<PaypalOrderStatusResponse | null> => {
  const paypalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`;
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${bearerToken}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const response = await fetch(paypalOrderUrl, {
      ...requestOptions,
      cache: "no-store",
      redirect: "follow",
    }).then((r) => r.json());
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};
