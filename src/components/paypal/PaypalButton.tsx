"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from "@paypal/paypal-js";
import React from "react";
import { paypalCheckPayment, setTransactionId } from "@/actions";

interface Props {
  orderId: string;
  amount: number;
}

const PaypalButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const roundedAmount = Math.round(amount * 100) / 100;

  const handleCreateOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            value: `${roundedAmount}`,
            currency_code: "USD",
          },
        },
      ],
    });

    // Todo: save Id in order in DB
    const { ok } = await setTransactionId(transactionId, orderId);

    if (!ok) throw new Error("Could not update the order");

    return transactionId;
  };

  const handleOnApprove = async (
    data: OnApproveData,
    actions: OnApproveActions
  ): Promise<void> => {
    console.log("onApprove");
    const details = await actions.order?.capture();
    if (!details) return;

    await paypalCheckPayment(details.id!);
  };

  if (isPending)
    return (
      <div className="animate-pulse mb-16">
        <div className="h-11 rounded bg-gray-300"></div>
        <div className="h-11 rounded bg-gray-300 mt-2"></div>
      </div>
    );
  return (
    <PayPalButtons
      createOrder={handleCreateOrder}
      onApprove={handleOnApprove}
    />
  );
};

export default PaypalButton;
