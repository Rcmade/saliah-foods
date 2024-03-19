"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import Products from "@/app/products.json";
import Card from "@/app/products-card";
import { useRouter, useSearchParams } from "next/navigation";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mulish } from "next/font/google";
import { useMediaQuery } from "usehooks-ts";
import { ProductSchema } from "@/lib/models/products.model";
const mulish = Mulish({ subsets: ["latin"] });

enum SortType {
  Default = "Default",
  PriceLowToHigh = "Price - Low to High",
  PriceHighToLow = "Price - High to Low",
}
const ProductListComponent = ({ products }: { products: ProductSchema[] }) => {
  const [productsImage, setProductsImage] = React.useState<any>(
    products[0]?.images || null
  );
  const searchParams = useSearchParams();

  React.useEffect(() => {
    // setProducts(Products);
    setProductsImage(Products?.products[0].images);
  }, []);
  const [selected, setSelected] = useState(
    searchParams.get("category") || "All Categories"
  );
  const [filteredProducts, setFilteredProducts] = useState<ProductSchema[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [productFilter, setProductFilter] = useState(false);

  const [priceRange, setPriceRange] = useState([0, 500]);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setProductFilter(true);
    }

    return () => {};
  }, []);

  // Define a variable to hold the timer ID
  let debounceTimer: ReturnType<typeof setTimeout>;
  // Define your debounced handler function
  const handlePriceChange = (e: number[]) => {
    // Clear the previous timer
    clearTimeout(debounceTimer);
    // Set a new timer to update the state after 300ms of inactivity
    debounceTimer = setTimeout(() => {
      setPriceRange([e[0], e[1]]);
    }, 300);
  };

  const [sortType, setSortType] = useState<SortType>(SortType.Default);

  const handleFilterSelected = (e: string) => {
    setSelected(e);
  };

  useEffect(() => {
    handleFilterSelected(searchParams.get("category") || "All Categories");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  const minMaxPrice = (
    minMax: "min_price" | "max_price",
    productData: ProductSchema
  ): number => {
    return (
      (productData?.varient &&
        productData?.varient[0] &&
        productData?.varient[0]?.price_range?.[minMax]) ||
      productData?.price_range?.[minMax]
    );
  };

  function filterProductsByPriceRange(
    minPrice: number,
    maxPrice: number,
    products: ProductSchema[]
  ): ProductSchema[] {
    return products.filter((product) => {
      // const { price_range } = product;
      const minimumPrice = minMaxPrice("min_price", product);
      const maximumPrice = minMaxPrice("max_price", product);
      return +minimumPrice >= minPrice && +maximumPrice <= maxPrice;
    });
  }

  function sortProducts(
    sortType: SortType,
    products: ProductSchema[]
  ): ProductSchema[] {
    if (sortType === SortType.Default) {
      // No sorting needed, return products as is
      return products;
    } else if (sortType === SortType.PriceLowToHigh) {
      // Sort products by price in ascending order
      return products.slice().sort((a, b) => {
        const minimumAPrice = minMaxPrice("min_price", a);
        const minimumBPrice = minMaxPrice("min_price", b);
        return minimumAPrice - minimumBPrice;
      });
    } else if (sortType === SortType.PriceHighToLow) {
      return products.slice().sort((a, b) => {
        const minimumAPrice = minMaxPrice("min_price", a);
        const minimumBPrice = minMaxPrice("min_price", b);
        return minimumBPrice - minimumAPrice;
      });
    }
    return products; // Default: return products as is
  }

  const filterProductsByCategory = (
    selected: string,
    sortType: SortType,
    priceRange: number[]
  ) => {
    let filteredProducts = products;
    filteredProducts = products?.filter((item: ProductSchema) =>
      selected === "All Categories" ? item : item.category?.includes(selected)
    );
    filteredProducts = filterProductsByPriceRange(
      priceRange[0],
      priceRange[1],
      filteredProducts
    );
    filteredProducts = sortProducts(sortType, filteredProducts);
    setFilteredProducts(filteredProducts);
  };

  const filterOptions = [
    {
      option: "All Categories",
    },
    {
      option: "Date Syrup",
    },
    {
      option: "Dates",
    },
    {
      option: "Fusions",
    },
    {
      option: "Gift Hampers",
    },
    {
      option: "Honey",
    },
    {
      option: "Mini Bytes",
    },
    // {
    //   option: "Uncategorized",
    // },
  ];

  const lengthOfProducts = products ? products?.length : 0;

  const [lengths, setLengths] = useState<{
    DateSyrup: number;
    Dates: number;
    AllCategories: number;
    Fusions: number;
    GiftHampers: number;
    Honey: number;
    MiniBytes: number;
    // Uncategorized: number;
    [key: string]: number; // Index signature for dynamic keys
  }>({
    DateSyrup: 0,
    Dates: 0,
    AllCategories: 0,
    Fusions: 0,
    GiftHampers: 0,
    Honey: 0,
    MiniBytes: 0,
  });

  const filterTotalItems = () => {
    const categories = [
      "Date Syrup",
      "Dates",
      "All Categories",
      "Fusions",
      "Gift Hampers",
      "Honey",
      "Mini Bytes",
      // "Uncategorized",
    ];

    const updatedLengths: any = {};

    categories.forEach((category) => {
      const filteredItems = products?.filter(
        (item: any) => item?.category === category
      );

      updatedLengths[category] = filteredItems?.length;
    });

    setLengths(updatedLengths);
  };

  useEffect(() => {
    filterProductsByCategory(selected, sortType, priceRange);
    filterTotalItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, sortType, priceRange]);
  const router = useRouter();

  return (
    <>
      <div className="relative">
        <Image
          src={"/productsBanner.png"}
          alt="banner"
          width={1440}
          height={600}
          className="w-full h-[300px] md:h-[70vh] object-cover z-20 "
        />

        <div className="z-0 flex  flex-col absolute top-20 md:top-40 left-0 md:ml-10 px-6 text-white">
          <span className="font-semibold text-[#D2B093]">
            <span className="cursor-pointer" onClick={() => router.push("/")}>
              Home &nbsp;
            </span>
            {">"} &nbsp;
            <span
              className="cursor-pointer"
              onClick={() => router.push("/product-list")}
            >
              Shop
            </span>
          </span>
          <span className="text-4xl md:text-7xl md:my-6 text-[#B68050] my-3">
            ALL PRODUCTS
          </span>
          <span className="text-lg md:w-[600px] font-semibold text-[#C3966F]">
            Our date syrup can be used in addition to or instead of honey or
            syrup and as a substitute for refined sugar in baking and cooking.
            Mix in cereal or coffee for a hint of sweetness.
          </span>
        </div>
      </div>

      <div
        className={`flex  gap-4 px-5 md:px-20 py-8 z-50 bg-[url('/net.png')] bg-contain ${mulish.className}`}
      >
        {productFilter ? (
          <div
            className={
              "fixed md:sticky top-0 left-0 h-screen md:h-fit w-[80vw] md:w-[288px] bg-primary-100 px-4 rounded-md font-sans bg-white z-[2]"
            }
          >
            <div className="flex justify-between py-4 pb-6">
              <h3 className="text-xl">Filter </h3>
              <Image
                src={"/close.png"}
                alt="close"
                width={24}
                height={24}
                onClick={() => setProductFilter(!productFilter)}
                className="cursor-pointer md:hidden"
              />
            </div>
            <div className="pb-2">
              <h3 className="font-semibold mb-4">CATEGORIES</h3>
              {filterOptions?.map((value, index) => {
                const length = lengths[value.option];
                return (
                  <p
                    key={index}
                    className={`mb-2 font-semibold cursor-pointer ${
                      selected === value.option
                        ? "text-primary-500 border-b border-primary-500 w-fit"
                        : "text-light-500"
                    }`}
                    onClick={() => {
                      router.push(`/product-list?category=${value.option}`, {
                        scroll: false,
                      });
                      if (isMobile) {
                        setProductFilter(!productFilter);
                      }
                      handleFilterSelected(value.option);
                    }}
                  >
                    {value.option} (
                    {value.option === "All Categories"
                      ? //  ||
                        // value.option === "Uncategorized"
                        lengthOfProducts
                      : length}
                    )
                  </p>
                );
              })}
            </div>
            <div>
              <h3 className="text-primary-500">PRICE</h3>
              <div>
                <div className="my-8">
                  <label className="text-lg font-bold mb-2 block">
                    Price Range:
                  </label>
                  <div className="h-4">
                    <Slider
                      className="h-4"
                      range
                      defaultValue={[0, 499]}
                      min={0}
                      max={500}
                      onChange={(e) => handlePriceChange(e as number[])}
                      styles={{
                        rail: {
                          background: "white",
                          borderRadius: "10px",
                        },
                        track: {
                          background: "#b68050",
                        },
                        handle: {
                          width: "20px",
                          height: "20px",
                          border: "none",
                          background: "#b68050",
                          opacity: 1,
                          transform: "translateX(-50%) translateY(-3px)",
                        },
                      }}
                    />
                  </div>
                  <div className="flex gap-2 justify-center py-2 w-full">
                    <span>₹{priceRange[0]}</span> -
                    <span> ₹{priceRange[1] || "500"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="w-full">
          <div className=" md:mb-10 mb-4  md:flex md:flex-row flex-col justify-between mr-8">
            <div className=" relative z-[1]">
              <div className="flex items-center gap-2">
                <span className="text-light-500">Sort by:</span>
                <Select onValueChange={(e: SortType) => setSortType(e)}>
                  <SelectTrigger className="w-[200px] bg-transparent border border-[#C2BDB9] text-base font-normal">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SortType).map((key) => (
                      <SelectItem key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="md:flex gap-2 hidden  text-light-500 my-4 md:my-0 items-center">
              <div className="flex-none">
                <Image src={"/home.png"} alt="home" width={18} height={18} />
              </div>
              <span onClick={() => router.push("/")} className="cursor-pointer">
                Home
              </span>
              <span>&gt;</span>
              <span
                className="cursor-pointer"
                onClick={() => router.push("/product-list")}
              >
                Categories
              </span>
            </div>
          </div>
          <div className="flex md:hidden justify-between border-b-2 border-[#E1CBB7] pb-6">
            <span>{lengthOfProducts} Products</span>
            <span className="border-b-[1px] border-black">Sort by</span>
          </div>
          <div className="mt-6 md:hidden flex justify-between">
            <span
              onClick={() => setProductFilter(!productFilter)}
              className="font-semibold text-xl flex items-center gap-2"
            >
              Filter
              <Image
                src={"/filter.png"}
                alt="ajwa"
                width={88}
                height={88}
                className="w-[20px]"
              />
            </span>
            <span className="flex items-center">
              <Image
                src={"/vert.png"}
                alt="ajwa"
                width={88}
                height={88}
                className="w-[40px]"
                onClick={() => setProductFilter(!productFilter)}
              />
              <Image
                src={"/horiz.png"}
                alt="ajwa"
                width={88}
                height={88}
                className="w-[40px]"
                onClick={() => setProductFilter(!productFilter)}
              />
            </span>
          </div>
          <div>
            <Card
              productsImage={productsImage}
              filteredProducts={filteredProducts}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default ProductListComponent;

const sortByCollection = [
  {
    option: "Default",
  },
  {
    option: "Price - Low to High",
  },
  {
    option: "Price - High to Low",
  },
];
