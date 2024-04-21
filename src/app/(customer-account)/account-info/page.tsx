"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "../../../../components/button/Button";
import InputField from "../../../../components/input-field/input-field";
import { useUser } from "@/components/Providers/user-provider";
import {
  logoutAction,
  updateUser,
  userOrders,
} from "@/lib/actions/user-actions";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useWishlist } from "@/components/Providers/wish-list-provider";
import { ActionTypes, useCart } from "@/app/cart";
import { IOrder } from "@/lib/models/order.model";
import { transformedOrderData } from "@/lib/utils";
import { TransformedOrderDataType } from "@/lib/types";
import { CircleUserRound } from "lucide-react";
import { User } from "@/lib/interface";
import Address from "@/components/Address/Address";

const MyAccount = () => {
  const searchParams = useSearchParams();
  const [menu, setMenu] = useState(searchParams.get("tab") || "Profile");
  const { user, dispatch } = useUser();
  const router = useRouter();
  const [userInput, setUserInput] = useState({
    name: user?.name,
    phone: user?.phone,
    email: user?.email,
  });
  const [orders, setOrders] = useState<TransformedOrderDataType[]>();
  const { toggleSidebar, cartDispatch } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    setUserInput({
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
    });
    return () => {};
  }, [user]);

  useEffect(() => {
    if (searchParams.get("tab")) {
      setMenu(searchParams.get("tab") || "Profile");
    }
  }, [searchParams]);

  const handleLogout = async () => {
    dispatch({ type: "LOGOUT" });
    await logoutAction();
    router.replace("/");
  };

  const handleUpdate = async () => {
    if (user) {
      const data = await updateUser(user, userInput as User);
      if (data?.user) {
        dispatch({
          type: "LOGIN",
          payload: { ...data?.user, token: user?.token },
        });
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    }
  };

  const getOrders = async () => {
    try {
      if (user?._id) {
        const o = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user?._id }),
          }
        )
          .then((res) => res.json())
          .then(async (data) => {
            if (data?.error) {
              toast.error(data.error);
            } else {
              const transform = await transformedOrderData(data);
              setOrders(transform);
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
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

    // console.log({ addItemToCart, value });

    cartDispatch({ type: ActionTypes.ADD_TO_CART, payload: addItemToCart });
    toggleSidebar();
  };

  useEffect(() => {
    getOrders();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <div className="md:p-20 md:pt-10 overflow-hidden">
        <h2 className="text-primary-500 text-4xl text-center tracking-wide mt-4 mb-6">
          {menu === "Logout" ? "My account" : menu}
        </h2>
        <div className="flex gap-20 items-start flex-col md:flex-row">
          <div className="bg-[#F0E5DB] w-full md:w-[286px] sticky top-0 p-4 rounded-md flex-none">
            <div className="relative w-fit">
              <CircleUserRound className="w-20 h-20 text-[#949494]" />
            </div>
            <div className="mt-8 grid gap-4">
              {sidebarArray?.map((value, index) => {
                return (
                  <div
                    key={index}
                    className={`pb-2 cursor-pointer ${
                      menu === value.value
                        ? "text-primary-500 border-b-2 border-primary-500"
                        : "text-black-600"
                    }`}
                    onClick={() => {
                      setMenu(value.value);
                      router.push(`?tab=${value.value}`);
                    }}
                  >
                    {value.value}
                  </div>
                );
              })}
            </div>
          </div>
          {menu === "Profile" && (
            <div className="w-full p-6 md:p-0">
              <div className="w-[800px]">
                <div className="flex items-center gap-4">
                  <div>
                    <CircleUserRound className="w-20 h-20 text-[#949494]" />
                    {/* <Image
                      src={"/profile.png"}
                      alt="profile"
                      width={60}
                      height={60}
                    /> */}
                  </div>
                  <div>
                    <h3 className="font-semibold text-2xl mb-2">
                      {user?.name}
                    </h3>
                    <div className="flex">
                      <Image
                        src={"/location.png"}
                        alt="location"
                        width={20}
                        height={20}
                      />
                      <span className="text-light-500">India</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mt-8">
                    <div className="flex gap-2 items-center w-full">
                      <div>
                        <Image
                          src={"/phone.png"}
                          alt="phone"
                          width={36}
                          height={36}
                        />
                      </div>
                      <div className="leading-none w-full">
                        <label
                          htmlFor="phone"
                          className="text-light-500 text-xs font-semibold block"
                        >
                          Phone number
                        </label>{" "}
                        <input
                          type="number"
                          id="phone"
                          min={9}
                          name="phone"
                          defaultValue={user?.phone || ""}
                          onChange={(e) => {
                            setUserInput({
                              ...userInput,
                              phone: e.target.value,
                            });
                          }}
                          // readOnly={user?.phone ? true : false}
                          placeholder="+0 1234567891"
                          className="outline-none px-2 text-xs font-semibold pl-0 w-full"
                        />
                      </div>
                    </div>
                    <div className="cursor-pointer">
                      <Image
                        src={"/right-arrow.png"}
                        alt="copy"
                        width={24}
                        height={24}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-8">
                    <div className="flex gap-2 items-center">
                      <div>
                        <Image
                          src={"/phone.png"}
                          alt="phone"
                          width={36}
                          height={36}
                        />
                      </div>
                      <div className="leading-none">
                        <label
                          htmlFor="phone"
                          className="text-light-500 text-xs font-semibold block"
                        >
                          Email
                        </label>{" "}
                        <input
                          type="email"
                          id="email"
                          required={user?.email ? false : true}
                          onChange={(e) => {
                            setUserInput({
                              ...userInput,
                              email: e.target.value,
                            });
                          }}
                          name="email"
                          readOnly={user?.email ? true : false}
                          defaultValue={user?.email}
                          className="outline-none px-2 text-xs font-semibold pl-0"
                        />
                      </div>
                    </div>
                    <div className="cursor-pointer">
                      <Image
                        src={"/copy.png"}
                        alt="copy"
                        width={24}
                        height={24}
                        onClick={() => {
                          navigator.clipboard.writeText(user?.email || "");
                          toast.success("Email copied to clipboard");
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end w-full mt-12">
                  <Button
                    text="Update"
                    parentClass="!w-fit"
                    className="px-6 text-sm font-semibold"
                    onClick={handleUpdate}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="w-full">
            {menu === "Orders" && (
              <div>
                {(orders || [])?.length > 0 ? (
                  <div className="grid grid-cols-6 mb-12 text-xs">
                    {orderTableHeading?.map((heading, index) => {
                      return (
                        <div key={index} className="font-semibold">
                          {heading.heading}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <h1 className="text-lg">No Orders Found</h1>
                )}
                <div>
                  {(orders || [])?.map((data, ind) => {
                    if (data?.paymentStatus?.toLocaleLowerCase() !== "paid")
                      return null;
                    return (
                      <div
                        key={ind}
                        className="grid grid-cols-6 py-4 border-b-2 items-center text-xs pl-2 pr-6"
                      >
                        <div>
                          <Image
                            src={data?.image}
                            alt="product"
                            width={90}
                            height={64}
                          />
                        </div>
                        <div className="ml-2">{data?.name || ""}</div>
                        <div className="flex h-full items-center" >{data?.createdAt}</div>
                        <div  className="flex h-full items-center">{data?.total}</div>
                        <div  className="flex h-full items-center">{data.status}</div>
                        <div className="px-6 py-2 bg-[#F7F2ED] w-fit text-primary-500 rounded-md cursor-pointer">
                          Track
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {menu === "Addresses" && (
              <>
                <Address />
              </>
            )}
            {menu === "Account details" && (
              <div className="lex flex-col text-xs px-10 mb-10">
                <h3 className="font-semibold">Change Personal Information</h3>
                <div className="mt-6 f md:grid gap-4">
                  <InputField
                    label="Username"
                    placeholder={user?.name}
                    defaultValue={user?.name || ""}
                    topClass="flex items-center gap-8 font-semibold"
                    labelClass="w-[200px]"
                    onChange={(e: any) =>
                      setUserInput((pre) => ({ ...pre, name: e.target.value }))
                    }
                  />
                  <InputField
                    label="Mobile No."
                    type="number"
                    placeholder="+1 23252598"
                    defaultValue={user?.phone || ""}
                    topClass="flex items-center gap-8 font-semibold"
                    labelClass="w-[200px]"
                    onChange={(e: any) =>
                      setUserInput((pre) => ({ ...pre, phone: e.target.value }))
                    }
                  />
                  <InputField
                    label="Email"
                    placeholder="user@saliahdates.com"
                    defaultValue={user?.email || ""}
                    topClass="flex items-center gap-8 font-semibold"
                    labelClass="w-[200px]"
                    onChange={(e: any) =>
                      setUserInput((pre) => ({ ...pre, email: e.target.value }))
                    }
                  />
                </div>
                <div className="w-full flex justify-end mt-8 border-b pb-4">
                  <Button
                    text="Done"
                    onClick={handleUpdate}
                    parentClass="!w-fit"
                    className="!px-8"
                  />
                </div>
                <h3 className="font-semibold">Change Password</h3>
                <div className="mt-6 grid gap-4">
                  <InputField
                    label="Password"
                    type="password"
                    topClass="flex items-center gap-8 font-semibold"
                    labelClass="w-[200px]"
                  />
                  <InputField
                    label="Confirm Password "
                    type="password"
                    topClass="flex items-center gap-8 font-semibold"
                    labelClass="w-[200px]"
                  />
                </div>
                <div className="w-full flex justify-end mt-8 border-b pb-4">
                  <Button
                    text="Update "
                    parentClass="!w-fit"
                    className="!px-8"
                  />
                </div>
                <div className="flex gap-4 mt-8">
                  <div className="w-[200px]">Account actions</div>
                  <div className="grid gap-4">
                    <div
                      onClick={handleLogout}
                      className="flex gap-2 cursor-pointer w-fit"
                    >
                      <Image
                        src={"/svg/logout.svg"}
                        alt="logout"
                        width={20}
                        height={20}
                      />
                      <span className="font-semibold">Log out</span>
                    </div>
                    <div className="flex gap-2 cursor-pointer w-fit">
                      <Image
                        src={"/svg/delete.svg"}
                        alt="trash"
                        width={20}
                        height={20}
                      />
                      <span className="text-[#E71D35] font-semibold">
                        Delete account
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {menu === "Wishlist" && (
              <>
                <div className="grid grid-cols-[10%_18%_18%_18%_18%_18%] mb-12">
                  {wishlistTableHeading?.map((heading, index) => {
                    return (
                      <div key={index} className="font-semibold text-[12px]">
                        {heading.heading}
                      </div>
                    );
                  })}
                </div>
                <div>
                  {wishlist?.length > 0
                    ? wishlist?.map((data, ind) => {
                        return (
                          <div
                            key={ind}
                            className="grid grid-cols-[10%_18%_18%_18%_18%_18%] py-4 border-b-2 items-center text-[12px]"
                          >
                            <div className="w-fit cursor-pointer">
                              <Image
                                src={"/close.png"}
                                alt="product"
                                width={20}
                                onClick={() => removeFromWishlist(data?._id)}
                                height={20}
                              />
                            </div>
                            <div>
                              <Image
                                src={data?.images[0] as any}
                                alt="product"
                                width={90}
                                height={64}
                              />
                            </div>
                            <div>{data.product}</div>
                            <div>{data?.price_range?.min_price}</div>
                            <div
                              className={`${
                                data?.quantity
                                  ? "text-[#1A5632]"
                                  : "text-[#E71D35]"
                              }`}
                            >
                              {data?.quantity ? "In Stock" : "Out of Stock"}
                            </div>
                            <div>
                              <Button
                                text="Add to Cart"
                                cartGolden={true}
                                onClick={() => handleCart(data)}
                                className="!bg-transparent text-primary-500 border border-primary-500 !px-4 text-[12px]"
                              />
                            </div>
                          </div>
                        );
                      })
                    : "No items in wishlist"}
                </div>
              </>
            )}
            {menu === "Logout" && (
              <div onClick={handleLogout} className="flex gap-8 my-10 p-6">
                <div>Account actions</div>
                <div className="flex gap-2 cursor-pointer">
                  <Image
                    src={"/svg/logout.svg"}
                    alt="logout"
                    width={16}
                    height={16}
                  />
                  <span className="font-semibold">Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default MyAccount;
const sidebarArray = [
  {
    value: "Profile",
  },
  {
    value: "Orders",
  },
  {
    value: "Addresses",
  },
  {
    value: "Account details",
  },
  {
    value: "Wishlist",
  },
  {
    value: "Logout",
  },
];
const orderTableHeading = [
  {
    heading: "Order ID",
  },
  {
    heading: "Product Name",
  },
  {
    heading: "Order Date",
  },
  {
    heading: "Price",
  },
  {
    heading: "Status",
  },
  {
    heading: "Action",
  },
];

const wishlistTableHeading = [
  {
    heading: "",
  },
  {
    heading: "Product",
  },
  {
    heading: "Product Name",
  },
  {
    heading: "Price",
  },
  {
    heading: "Status",
  },
  {
    heading: "Action",
  },
];
