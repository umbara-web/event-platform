// src/stores/cartStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Event, TicketTier, UserCoupon, PointsBalance } from '@/src/types';

interface CartItem {
  ticketTier: TicketTier;
  quantity: number;
}

interface CartState {
  event: Event | null;
  items: CartItem[];
  voucherCode: string | null;
  voucherDiscount: number;
  selectedCoupon: UserCoupon | null;
  couponDiscount: number;
  usePoints: boolean;
  pointsToUse: number;

  // Computed
  subtotal: number;
  totalDiscount: number;
  finalAmount: number;

  // Actions
  setEvent: (event: Event) => void;
  addItem: (ticketTier: TicketTier, quantity: number) => void;
  updateItemQuantity: (ticketTierId: string, quantity: number) => void;
  removeItem: (ticketTierId: string) => void;
  setVoucher: (code: string | null, discount: number) => void;
  setCoupon: (coupon: UserCoupon | null, discount: number) => void;
  setPoints: (usePoints: boolean, amount: number) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      event: null,
      items: [],
      voucherCode: null,
      voucherDiscount: 0,
      selectedCoupon: null,
      couponDiscount: 0,
      usePoints: false,
      pointsToUse: 0,
      subtotal: 0,
      totalDiscount: 0,
      finalAmount: 0,

      setEvent: (event) => {
        const currentEvent = get().event;
        // Clear cart if different event
        if (currentEvent && currentEvent.id !== event.id) {
          set({
            event,
            items: [],
            voucherCode: null,
            voucherDiscount: 0,
            selectedCoupon: null,
            couponDiscount: 0,
            usePoints: false,
            pointsToUse: 0,
            subtotal: 0,
            totalDiscount: 0,
            finalAmount: 0,
          });
        } else {
          set({ event });
        }
      },

      addItem: (ticketTier, quantity) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (item) => item.ticketTier.id === ticketTier.id
        );

        if (existingIndex >= 0) {
          const newItems = [...items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + quantity,
          };
          set({ items: newItems });
        } else {
          set({ items: [...items, { ticketTier, quantity }] });
        }

        get().calculateTotals();
      },

      updateItemQuantity: (ticketTierId, quantity) => {
        const items = get().items;

        if (quantity <= 0) {
          set({
            items: items.filter((item) => item.ticketTier.id !== ticketTierId),
          });
        } else {
          const newItems = items.map((item) =>
            item.ticketTier.id === ticketTierId ? { ...item, quantity } : item
          );
          set({ items: newItems });
        }

        get().calculateTotals();
      },

      removeItem: (ticketTierId) => {
        set({
          items: get().items.filter(
            (item) => item.ticketTier.id !== ticketTierId
          ),
        });
        get().calculateTotals();
      },

      setVoucher: (code, discount) => {
        set({ voucherCode: code, voucherDiscount: discount });
        get().calculateTotals();
      },

      setCoupon: (coupon, discount) => {
        set({ selectedCoupon: coupon, couponDiscount: discount });
        get().calculateTotals();
      },

      setPoints: (usePoints, amount) => {
        set({ usePoints, pointsToUse: amount });
        get().calculateTotals();
      },

      clearCart: () => {
        set({
          event: null,
          items: [],
          voucherCode: null,
          voucherDiscount: 0,
          selectedCoupon: null,
          couponDiscount: 0,
          usePoints: false,
          pointsToUse: 0,
          subtotal: 0,
          totalDiscount: 0,
          finalAmount: 0,
        });
      },

      calculateTotals: () => {
        const { items, voucherDiscount, couponDiscount, pointsToUse } = get();

        const subtotal = items.reduce(
          (sum, item) => sum + item.ticketTier.price * item.quantity,
          0
        );

        const totalDiscount = voucherDiscount + couponDiscount + pointsToUse;
        const finalAmount = Math.max(0, subtotal - totalDiscount);

        set({ subtotal, totalDiscount, finalAmount });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        event: state.event,
        items: state.items,
        voucherCode: state.voucherCode,
        voucherDiscount: state.voucherDiscount,
      }),
    }
  )
);

export default useCartStore;
