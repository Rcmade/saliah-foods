import Image from "next/image";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusSquareIcon } from "lucide-react";
import CreateUpdateAddressDialog from "../Dialogs/CreateUpdateAddressDialog";
import { useAddressModal } from "@/hooks/useAddressModal";
import { useUser } from "../Providers/user-provider";
import AddressCard from "../Cards/AddressCard";

const Address = () => {
  const { onOpen, getAddressArray, addressArray } = useAddressModal();
  const { user } = useUser();
  const getAddress = async () => {
    await getAddressArray(user?._id || "");
  };
  useEffect(() => {
    if (user?._id) {
      getAddress();
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <CreateUpdateAddressDialog />
      <div className="text-xs flex flex-col">
        <Button
          variant="outline"
          onClick={() => onOpen()}
          className="!text-primary-500 font-semibold text-left py-3 border border-primary-500 rounded-md justify-start"
        >
          <span className="text-xl mr-2 font-medium">+</span> ADD A NEW ADDRESS
        </Button>
        <div className="grid gap-8  grid-cols-1 px-6 md:px-0 md:grid-cols-2 mt-8">
          {(addressArray || []).map((address) => (
            <AddressCard {...address} key={address?._id || ""} />
          ))}
        </div>
        <div className="w-full flex justify-end my-12 pr-6 md:pr-0">
          {/* <Button text="Update" parentClass="!w-fit" className="!px-8" /> */}
        </div>
      </div>
    </>
  );
};

export default Address;
