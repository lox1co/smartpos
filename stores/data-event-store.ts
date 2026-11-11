import { create } from 'zustand';

interface DataEventState {
  productsVersion: number;
  transactionsVersion: number;
  customersVersion: number;
  notifyProductMutation: () => void;
  notifyCheckoutCompleted: () => void;
  notifyCustomerMutation: () => void;
  notifyAllChanged: () => void;
}

export const useDataEventStore = create<DataEventState>((set) => ({
  productsVersion: 0,
  transactionsVersion: 0,
  customersVersion: 0,

  notifyProductMutation: () =>
    set((state) => ({ productsVersion: state.productsVersion + 1 })),

  notifyCheckoutCompleted: () =>
    set((state) => ({
      transactionsVersion: state.transactionsVersion + 1,
      productsVersion: state.productsVersion + 1,
      customersVersion: state.customersVersion + 1,
    })),

  notifyCustomerMutation: () =>
    set((state) => ({ customersVersion: state.customersVersion + 1 })),

  notifyAllChanged: () =>
    set((state) => ({
      productsVersion: state.productsVersion + 1,
      transactionsVersion: state.transactionsVersion + 1,
      customersVersion: state.customersVersion + 1,
    })),
}));
