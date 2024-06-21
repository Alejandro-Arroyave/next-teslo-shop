import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];
  getTotalItems: () => number;
  getSummaryInformation: () => {
    itemsInCart: number;
    subTotal: number;
    tax: number;
    total: number;
  };
  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProductFromCart: (product: CartProduct) => void;
  clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      // Methods
      getTotalItems: () => {
        const { cart } = get();
        const totalItems = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );
        return totalItems;
      },
      getSummaryInformation: () => {
        const { cart } = get();

        const itemsInCart = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );
        const subTotal = cart.reduce(
          (subtotal, item) => subtotal + item.quantity * item.price,
          0
        );
        const tax = subTotal * 0.15;
        const total = subTotal + tax;

        return { itemsInCart, subTotal, tax, total };
      },
      addProductToCart: (product: CartProduct) => {
        const { cart } = get();

        // 1. See if product exists size included
        const productInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size
        );

        // 2. If not, add
        if (!productInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        // 3. If so, increment product
        const updatedCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: item.quantity + product.quantity };
          }

          return item;
        });

        set({ cart: updatedCartProducts });
      },
      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();

        const updatedCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity };
          }

          return item;
        });

        set({ cart: updatedCartProducts });
      },
      removeProductFromCart: (product: CartProduct) => {
        const { cart } = get();

        const updatedCartProducts = cart.filter((item) => {
          return !(item.id === product.id && item.size === product.size);
        });

        set({ cart: updatedCartProducts });
      },
      clearCart: () => {
        set({ cart: [] });
      },
    }),
    { name: "shopping-cart" }
  )
);
