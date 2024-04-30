"use client";
import Image from "next/image";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {useState,useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFeaturedData } from "@/lib/actions/product-actions";
import { ActionTypes, useCart } from "@/app/cart";
import { Button } from "../ui/button";
import { Mulish } from "next/font/google";
import { ProductSchema } from "@/lib/models/products.model";
import { syrupHealthData, syrupNaturalData } from "@/data/country-state-data";
const mulish = Mulish({ subsets: ["latin"] });

const DateSyrup =  () => {
  const [featuredProducts, setFeaturedProducts] = useState<ProductSchema[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFeaturedData();
        setFeaturedProducts(data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchData();
  }, []);
  const [selectedVariants, setSelectedVariants] = React.useState<{
    [key: string]: any;
  }>({});
  const { toggleSidebar, cartDispatch } = useCart();

  const handleVarient = (_id: any, variant: any) => {
    const vari = variant.varient.find((i: any) => i.unit === _id);
    if (vari) {
      setSelectedVariants((prevSelectedVariants) => ({
        ...prevSelectedVariants,
        [variant._id]: vari,
      }));
    }
  };

  const handleCart = (value: any) => {
    const price =
      selectedVariants?.[value._id]?.price_range?.min_price ||
      value?.varient?.[0]?.price_range?.min_price;
    const addItemToCart = {
      _id: value?._id,
      quantity: 1,
      total: price,
      product: {
        name: value?.product,
        image: value?.images?.[0],
        price: price,
        unit: selectedVariants?.[value._id]?.unit,
        category: value?.category,
      },
    };

    cartDispatch({ type: ActionTypes.ADD_TO_CART, payload: addItemToCart });
    toggleSidebar();
  };
  return (
    <>
      <Carousel
        className="w-full bg-[#EBDFD5] "
      >
        <CarouselContent className="max-h-[100rem] md:max-h-[61rem]">
          {featuredProducts.map((item, index) => (
            <CarouselItem key={index}>
              <div className=" bg-[url('/net.png')]">
                <h1 className="block text-primary-500 text-4xl justify-center  text-center md:py-10 pt-10 pb-0 tracking-wide bg-cover">
                  {item?.product}
                </h1>
                <div className="flex flex-col-reverse md:items-start md:flex md:grid-cols-3 md:gap-20 items-center md:py-20 py-8 p-6 md:px-20  bg-contain  md:flex-row-reverse">
                  <div className="flex-1">
                    <span className="text-[#B68050] text-3xl my-10 border-b-[1px] pb-3 md:pr-20 border-[#E1CBB7]">
                      Health Benefits
                    </span>
                    <ul className="grid md:grid-cols-1 grid-cols-2 items-start justify-start mt-10 gap-4 border-b-[1px] pb-3 md:pr-20 border-[#E1CBB7]">
                      {syrupHealthData?.map(
                        (value, index) => {
                          return (
                            <li
                              className="flex flex-col items-center justofy-between justify-start md:items-start md:flex-row gap-4 border-b border-[#F0E5DB] pb-4"
                              key={index}
                            >
                              <Image
                                src={value.imgUrl}
                                alt="image"
                                width={52}
                                height={52}
                              />
                              <span className="flex flex-col mt-auto mb-auto">

                            
                              <span className="text-[#B68050] font-bold text-center  md:text-start mt-auto mb-auto">
                                {value.benefits.toUpperCase()}
                              </span>
                              <span className="text-[#B68050] font-bold text-center  md:text-start mt-auto mb-auto">
                                {value.benefits2.toUpperCase()}
                              </span>
                              </span>
                            </li>
                          );
                        }
                      )}
                    </ul>

                    <ul className="grid md:grid-cols-1 grid-cols-2 items-start justify-start mt-10 gap-4  pb-3 md:pr-20 border-[#E1CBB7]">
                      {syrupNaturalData?.map(
                        (value, index) => {
                          return (
                            <li
                              className="flex flex-col items-center justofy-between justify-start md:items-start md:flex-row gap-4 border-b border-[#F0E5DB] pb-4"
                              key={index}
                            >
                              <Image
                                src={value.imgUrl}
                                alt="image"
                                width={52}
                                height={52}
                              />
                              <span className="flex flex-col mt-auto mb-auto">

                            
                              <span className="text-[#B68050] font-bold text-center  md:text-start mt-auto mb-auto">
                                {value.benefits.toUpperCase()}
                              </span>
                              <span className="text-[#B68050] font-bold text-center  md:text-start mt-auto mb-auto">
                                {value.benefits2.toUpperCase()}
                              </span>
                              </span>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>
                  <div className="text-center  flex-1 md:block hidden">
                    <Image
                      src={item?.images[0]}
                      alt="banner"
                      width={300}
                      height={600}
                      className="w-full"
                    />
                    <div>
                      <h3 className="font-semibold my-6">
                        {selectedVariants[item?._id]?.unit ||
                          "400gm, pack of 1"}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-col flex-1 w-screen p-6 md:p-0">
                    <span className="text-[#B68050] text-2xl uppercase md:border-none border-b border-primary-500 md:pb-0 pb-2">
                      Description
                    </span>
                    <p className="md:my-10 mt-4 mb-0 text-[#847A73]">
                      {item.description}
                    </p>
                    <p className="text-[#847A73]">
                      Mix in cereal or coffee for a hint of sweetness.
                    </p>

                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          <div className="flex w-full justify-between rounded-full px-4 border-[1px] md:mt-10 mt-2 border-[#E1CBB7] py-2 my-2">
                            <span className="text-[#847A73] font-semibold">
                              Benefits
                              {/* {item.additional_information.benefits} */}
                            </span>
                            <span
                              className="cursor-pointer "
                              // onClick={() => expendContent()}
                            >
                              <Image
                                src={"/svg/expend-button.png"}
                                alt="heart"
                                width={24}
                                height={24}
                              />
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {item.additional_information?.benefits}
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>
                          <div className="flex w-full justify-between rounded-full px-4 border-[1px]   border-[#E1CBB7] py-2 ">
                            <span className="text-[#847A73] font-semibold">
                              Ingredients
                            </span>
                            <span className="cursor-pointer ">
                              <Image
                                src={"/svg/expend-button.png"}
                                alt="heart"
                                width={24}
                                height={24}
                              />
                            </span>
                          </div>
                        </AccordionTrigger>
                      </AccordionItem>
                    </Accordion>

                    <div className="md:block hidden">
                      <div className="uppercase md:mt-20 mt-4 text-[#2a2a2a] font-bold">
                        Pricing Options
                      </div>
                      <div className="md:block grid grid-cols-2 gap-2 items-center">
                        <div className="md:my-5 dropdown bg-[url('/dropdown.png')] bg-contain h-fit">
                          <Select
                            onValueChange={(e) => {
                              handleVarient(e, item);
                            }}
                          >
                            <SelectTrigger className="bg-transparent border-[2px] border-[#E1CBB7] rounded-full md:p-4 p-2 w-full md:w-[400px]">
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {item.varient?.map((i:any)=> (
                                <SelectItem key={i.unit} value={i.unit}>
                                  {`Unit ${i.unit}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Button
                            onClick={() => handleCart(item)}
                            className={`text-lg rounded-full uppercase font-bold px-6 py-4 ${mulish.className}`}
                          >
                            Add To Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:hidden block w-full">
                    <div className="uppercase md:mt-20 mt-4 text-[#2a2a2a] font-bold">
                      Pricing Options
                    </div>
                    <div className="md:block grid grid-cols-2 gap-2 items-center">
                      <div className="md:my-5 dropdown bg-[url('/dropdown.png')] bg-contain h-fit">
                        <Select
                          onValueChange={(e) => {
                            handleVarient(e, item);
                          }}
                        >
                          <SelectTrigger className="bg-transparent border-[2px] border-[#E1CBB7] rounded-full md:p-4 p-2 w-full md:w-[400px]">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {item.varient?.map((i: any) => (
                              <SelectItem key={i.unit} value={i.unit}>
                                {`Unit ${i.unit}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Button
                          onClick={() => handleCart(item)}
                          className={`text-lg rounded-full uppercase font-bold px-6 py-4 ${mulish.className}`}
                        >
                          Add To Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="text-center  flex-1 md:hidden block w-full">
                    <Image
                      src={item.images[0]}
                      alt="banner"
                      width={300}
                      height={600}
                      className="w-full"
                    />
                    <div>
                      <h3 className="font-semibold md:my-6 mt-4 mb-2">
                        {selectedVariants[item?._id]?.unit ||
                          "400gm, pack of 1"}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="absolute flex w-full justify-center h-10">
                  <CarouselPrevious className="relative -mt-12  md:-mt-32 xl:-mt-24 -mr-10 text-[#bd8050]  border-2 bg-transparent border-[#E1CBB7]  disabled:border-none p-2 text-2xl w-10 h-10 md:w-16 md:h-16  " />
                  <CarouselNext className="relative -mt-12 md:-mt-32 -ml-10 xl:-mt-24 text-[#bd8050]  border-2 bg-transparent border-[#E1CBB7]  disabled:border-none p-2 text-2xl w-10 h-10 md:w-16 md:h-16  " />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
};

export default DateSyrup;
