"use client";
import Image from "next/image";
import Button from "../button/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ActionTypes, useCart } from "@/app/cart";
import { useWishlist } from "@/components/Providers/wish-list-provider";
import { toast } from "sonner";
import HeartIcon from "@/components/Icons/HeartIcon";

const BestSeller = (props: any) => {
  const data = props.data;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Best Sellers");
  const { toggleSidebar, cartDispatch } = useCart();
  const [switchTabs, setSwitchTabs] = useState<string>("Best Sellers");

  const handleSwitch = (
    event: React.MouseEvent<HTMLSpanElement>,
    tabValue: any
  ) => {
    event.preventDefault(); // Prevent any default behavior if needed
    setSwitchTabs(tabValue);
    setActiveTab(tabValue);
  };

  const handleCart = (value: any) => {
    // value?
    const price = value?.varient?.[0]?.price_range?.min_price;
    const addItemToCart = {
      _id: value?._id,
      quantity: 1,
      total: price,
      product: {
        name: value?.product,
        image: value?.images?.[0],
        price: price,
        unit: value?.unit,
        category: value?.category,
      },
    };

    cartDispatch({ type: ActionTypes.ADD_TO_CART, payload: addItemToCart });
    toggleSidebar();
  };

  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  return (
    <>
      <div className="text-center  flex gap-6 justify-center text-[#847A73] ">
        {productTabs?.map((value, index) => {
          return (
            <div className="relative " key={index}>
              <span
                className={` pb-2 ${activeTab === value.tabValue ? "active double" : ""
                  }`}
              >
                <span
                  className={`cursor-pointer pb-3 h-6 hover:border-b-[#b68050] z-10 ${activeTab === value.tabValue ? "active double" : ""
                    }`}
                  onClick={(e) => handleSwitch(e, value.tabValue)} // Pass event object and tabValue
                  key={index}
                >
                  {value.tabValue}
                </span>
              </span>
            </div>
          );
        })}
      </div>
      {switchTabs === "Best Sellers" ? (
        <div className=" grid grid-cols-2 md:grid-cols-4 gap-4 md:px-40 my-8 md:mx-0 mx-2">
          {data?.map((item: any) => {
            return (
              item.homePageType === "Best Sellers" && (
                <div
                  key={item._id}
                  className="relative group/add max-w-full w-80 md:pb-4 pb-2"
                >
                  <div className="h-80 max-h-96 relative flex justify-center items-center">
                    <div className="w-full h-full">
                      <Image
                        src={item.images[0]}
                        alt={item?.category}
                        layout="fill"
                        objectFit="cover"
                        className="w"
                      />
                    </div>
                    <div className="absolute transition-all duration-500 opacity-0 group-hover/add:!opacity-90  w-5/6 md:w-2/3  h-5/6 md:h-w-2/3  bg-primary-500 flex flex-col justify-between items-center py-6 md:py-4 ">
                      <div className="bg-primary-500 text-white px-4 py-2 border border-white flex gap-4 m-auto">
                        {wishlist?.find(
                          (wish: any) => wish?._id === item?._id
                        ) ? (
                          <span
                            onClick={() => {
                              removeFromWishlist(item?._id);
                              toast.error("Removed from wishlist");
                            }}
                            title="Remove to wishlist"
                            className="text-white cursor-pointer text-xl"
                          >
                            <HeartIcon />
                          </span>
                        ) : (
                          <Image
                            src={"/svg/heart.svg"}
                            alt={"like"}
                            width={24}
                            height={24}
                            title="Add to wishlist"
                            className="z-10 relative cursor-pointer"
                            onClick={() => {
                              addToWishlist(item);
                              toast.success("Added to wishlist");
                            }}
                          />
                        )}
                        <Image
                          src={"/svg/eye.svg"}
                          alt={"eye"}
                          width={24}
                          height={24}
                          className="cursor-pointer"
                          onClick={() => {
                            router.push(`/product-details/${item._id}`);
                          }}
                        />
                      </div>
                      <div>
                        <button
                          disabled={!item?.quantity}
                          onClick={() => {
                            if (!item?.quantity) {
                              toast.error("This product is out of stock");
                            } else {
                              handleCart(item);
                            }
                          }}
                          className="bg-primary-500 text-white px-4 py-2 border border-white text-[12px]"
                        >
                          {item?.quantity ? "ADD TO CART" : "Out of stock"}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col mt-2 md:mb-2 md:mt-4 md:gap-2">
                    <span className="text-center font-bold text-[#1A5632]">
                      {item?.category}
                    </span>
                    <span className="text-center text-xl md:text-xl font-semibold text-[#B68050]">
                      {item?.product}
                    </span>
                  </div>
                </div>
              )
            );
          })}
        </div>
      ) : switchTabs === "Sale" ? (
        <div className=" grid grid-cols-2 md:grid-cols-4 gap-4 md:px-40 my-8 md:mx-0 mx-2">
          {data?.map((item: any) => {
            return (
              item.homePageType === "Sale" && (
                <div
                  key={item._id}
                  className="relative group/add max-w-full w-80 md:pb-4 pb-2"
                >
                  <div className="h-80 max-h-96 relative flex justify-center items-center">
                    <div className="w-full h-full">
                      <Image
                        src={item.images[0]}
                        alt={item?.category}
                        layout="fill"
                        objectFit="cover"
                        className="w"
                      />
                    </div>
                    <div className="absolute transition-all duration-500 opacity-0 group-hover/add:!opacity-90  w-5/6 md:w-2/3  h-5/6 md:h-w-2/3  bg-primary-500 flex flex-col justify-between items-center py-6 md:py-4 ">
                      <div className="bg-primary-500 text-white px-4 py-2 border border-white flex gap-4 m-auto">
                        <Image
                          src={"/svg/heart.svg"}
                          alt={"like"}
                          width={24}
                          height={24}
                          className="z-10 relative cursor-pointer"
                          onClick={() => {
                            addToWishlist(item);
                            toast.success("Added to wishlist");
                          }}
                        />
                        <Image
                          src={"/svg/eye.svg"}
                          alt={"eye"}
                          width={24}
                          height={24}
                          className="cursor-pointer"
                          onClick={() => {
                            router.push(`/product-details/${item._id}`);
                          }}
                        />
                      </div>
                      <div>
                        <button
                          disabled={!item?.quantity}
                          onClick={() => {
                            if (!item?.quantity) {
                              toast.error("This product is out of stock");
                            } else {
                              handleCart(item);
                            }
                          }}
                          className="bg-primary-500 text-white px-4 py-2 border border-white text-[12px]"
                        >
                          {item?.quantity ? "ADD TO CART" : "Out of stock"}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col mt-2 md:mb-2 md:mt-4 md:gap-2">
                    <span className="text-center font-bold text-[#1A5632]">
                      {item?.category}
                    </span>
                    <span className="text-center text-xl md:text-xl font-semibold text-[#B68050]">
                      {item?.product}
                    </span>
                  </div>
                </div>
              )
            );
          })}
        </div>
      ) : switchTabs === "New Arrivals" ? (
        <div className=" grid grid-cols-2 md:grid-cols-4 gap-4 md:px-40 my-8 md:mx-0 mx-2">
          {data?.map((item: any) => {
            return (
              item.homePageType === "New Arrivals" && (
                <div
                  key={item._id}
                  className="relative group/add max-w-full w-80 md:pb-4 pb-2"
                >
                  <div className="h-80 max-h-96 relative flex justify-center items-center">
                    <div className="w-full h-full">
                      <Image
                        src={item.images[0]}
                        alt={item?.category}
                        layout="fill"
                        objectFit="cover"
                        className="w"
                      />
                    </div>
                    <div className="absolute transition-all duration-500 opacity-0 group-hover/add:!opacity-90  w-5/6 md:w-2/3  h-5/6 md:h-w-2/3  bg-primary-500 flex flex-col justify-between items-center py-6 md:py-4 ">
                      <div className="bg-primary-500 text-white px-4 py-2 border border-white flex gap-4 m-auto">
                        <Image
                          src={"/svg/heart.svg"}
                          alt={"like"}
                          width={24}
                          height={24}
                          className="z-10 relative cursor-pointer"
                          onClick={() => {
                            addToWishlist(item);
                            toast.success("Added to wishlist");
                          }}
                        />
                        <Image
                          src={"/svg/eye.svg"}
                          alt={"eye"}
                          width={24}
                          height={24}
                          className="cursor-pointer"
                          onClick={() => {
                            router.push(`/product-details/${item._id}`);
                          }}
                        />
                      </div>
                      <div>
                        <button
                          disabled={!item?.quantity}
                          onClick={() => {
                            if (!item?.quantity) {
                              toast.error("This product is out of stock");
                            } else {
                              handleCart(item);
                            }
                          }}
                          className="bg-primary-500 text-white px-4 py-2 border border-white text-[12px]"
                        >
                          {item?.quantity ? "ADD TO CART" : "Out of stock"}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col mt-2 md:mb-2 md:mt-4 md:gap-2">
                    <span className="text-center font-bold text-[#1A5632]">
                      {item?.category}
                    </span>
                    <span className="text-center text-xl md:text-xl font-semibold text-[#B68050]">
                      {item?.product}
                    </span>
                  </div>
                </div>
              )
            );
          })}
        </div>
      ) : null}

      <div className="grid justify-center">
        <Button
          text="View all"
          className="!bg-transparent text-primary-500 border border-[#D2B093] font-semibold px-10"
          onClick={() => router.push("/product-list")}
        />
      </div>
    </>
  );
};
export default BestSeller;
const productTabs = [
  {
    tabValue: "Best Sellers",
  },
  {
    tabValue: "New Arrivals",
  },
  {
    tabValue: "Sale",
  },
];
const productCollection = [
  {
    imageUrl: "/dateSyrup.png",
    category: "Dates",
    name: "Ajwa Dates",
  },
  {
    imageUrl: "/syrup.png",
    category: "Specialties",
    name: "Date Syrup",
  },
  {
    imageUrl: "/syrup.png",
    category: "Date Syrup",
    name: "Specialties",
  },
  {
    imageUrl: "/syrup.png",
    category: "Date Syrup",
    name: "Specialties",
  },
];
