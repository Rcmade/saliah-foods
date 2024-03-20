import { useAddressModal } from "@/hooks/useAddressModal";
import { AddressT } from "@/lib/types";
import Image from "next/image";
import React from "react";

const AddressCard = ({
  _id,
  apartment,
  city,
  phone,
  pinCode,
  state,
  streetAddress,
  createdAt,
  createdId,
  updatedAt,
}: AddressT) => {
  const { onOpen } = useAddressModal();
  return (
    <div className="border-2 p-6 rounded-md">
      <div className="flex justify-between">
        <h3 className="font-semibold">{city}</h3>
        <div
          onClick={() =>
            onOpen({
              _id,
              apartment,
              city,
              phone,
              pinCode,
              state,
              streetAddress,
              createdAt,
              createdId,
              updatedAt,
            })
          }
          className="flex gap-2 cursor-pointer"
        >
          <Image
            src={"/edit.png"}
            alt="edit"
            width={20}
            height={20}
            className="!w-[20px] !h-[20px]"
          />
          <span className="font-semibold">Edit</span>
        </div>
      </div>
      <div className="mt-4">
        <div>{phone}</div>
        <div>{apartment || ""}</div>
        <div>{streetAddress || ""}</div>
        <div>{pinCode}</div>
        <div>{state}</div>
      </div>
    </div>
  );
};

export default AddressCard;
