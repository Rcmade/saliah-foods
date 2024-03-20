import { AddressT } from "@/lib/types";
import axios from "axios";
import { create } from "zustand";

type AddressModal = {
  isOpen: boolean;
  onOpen: (address?: AddressT) => void;
  onClose: () => void;
  address?: AddressT;
  addressArray?: AddressT[];
  setAddressArray: (addressArray: AddressT[]) => void;
  getAddressArray: (userId: string , refetch?:boolean) => Promise<AddressT[]>;
};

export const useAddressModal = create<AddressModal>((set, get) => ({
  isOpen: false,
  onOpen: (address) => set({ address: address, isOpen: true }),
  onClose: () => set({ isOpen: false, address: undefined }),
  setAddressArray: (addressArray) => set({ addressArray }),
  getAddressArray: async (userId, refetch) => {
    let addresses = get().addressArray;
    if (!addresses || refetch) {
      try {
        const response = await axios.get<{ data: AddressT[] }>(
          `/api/address?createdId=${userId}`
        );
        addresses = response.data?.data;
        set({ addressArray: addresses });
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
        // Handle error appropriately
      }
    }
    return addresses || [];
  },
}));
