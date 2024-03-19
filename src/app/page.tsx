import Image from "next/image";
import BestSeller from "../../components/best-seller/BestSeller";
import Button from "../../components/button/Button";
import Link from "next/link";
import Testimonials from "@/components/Landing/Testimonials";
import DateSyrup from "@/components/Landing/DateSyrup";
import ProductCollections from "@/components/Landing/ProductCollections";
import { getProductsData } from "@/lib/actions/product-actions";

export const fetchCache = "force-no-store";
export const dynamic = "force-dynamic";
export default async function Home() {
  const data = await getProductsData();
  return (
    <div className="overflow-hidden">
      <Image
        src={"/banner.svg"}
        alt="banner"
        width={1440}
        height={600}
        className="w-full h-[300px] md:h-[70vh] object-cover "
      />
      <div className="lg:py-12 pt-12 pb-8 bg-[url('/product-background.png')] bg-contain">
        <h2 className="text-primary-500 text-center">
          Delightful Products. Prosperous Life.
        </h2>
        <div className="flex gap-8 items-center justify-center">
          <Image
            src={"/svg/treeLeft.svg"}
            alt="banner"
            width={85}
            height={115}
            className="hidden md:block"
          />
          <h3 className="text-primary-500 md:my-2 mt-2 mb-4 text-2xl md:text-5xl">
            {" "}
            OUR PRODUCTS
          </h3>
          <Image
            src={"/svg/treeRight.svg"}
            className="hidden md:block"
            alt="banner"
            width={85}
            height={115}
          />
        </div>
        <BestSeller data={data || []} />
      </div>
      <DateSyrup />

      <div className="px-4 md:px-20 md:py-16 py-8 ">
        <div className="flex justify-between md:items-center flex-col md:flex-row text-center md:text-start">
          <h2 className="text-primary-500 text-3xl">
            Explore Our Exquisite <br /> Range of Date Products,
          </h2>
          <Link
            href="/product-list"
            className="text-primary-500 hidden md:block border-b border-black w-fit cursor-pointer mt-6"
          >
            Shop all products
          </Link>
        </div>
        <div className="no-scrollbar flex gap-4 md:justify-center justify-start text-start md:my-12 mt-12 mb-6 w-full md:overflow-y-hidden overflow-x-auto mr-10">
          <ProductCollections />
        </div>
        <div className="mx-auto flex w-fit justify-center items-center md:hidden">
          <Link href="/product-list">
            <Button
              text="View all"
              className="!bg-transparent text-primary-500 border border-[#D2B093] font-semibold px-10"
            />
          </Link>
        </div>
      </div>
      <div className="bg-[#F9F5F1] p-10 md:px-20 md:py-20">
        <Image
          src={"/svg/quotes.svg"}
          alt="quotes"
          width={24}
          height={24}
          className="m-auto md:block hidden"
        />
        <h3 className="md:hidden block text-center text-3xl text-primary-500">
          Customer’s Love
        </h3>
      
        <Testimonials />
     
      </div>
    </div>
  );
}
const dateSyrupBenefits = [
  {
    imgUrl: "/svg/dateSyrup/image01.svg",
    benefits: "Strengthening Bones",
  },
  {
    imgUrl: "/svg/dateSyrup/image03.svg",
    benefits: "Healthier Digestive System",
  },
  {
    imgUrl: "/svg/dateSyrup/image04.svg",
    benefits: "Good For Skin",
  },
  {
    imgUrl: "/svg/dateSyrup/image05.svg",
    benefits: "Anti-Oxidant",
  },
];

const anotherBenefits = [
  {
    imgUrl: "/svg/dateSyrup/image06.svg",
    benefits: "100% Natural",
  },
  {
    imgUrl: "/svg/dateSyrup/image07.svg",
    benefits: "No Added Sugar",
  },
];
const productsCollection = [
  {
    imageUrl: "/Date01.png",
    productName: "Dates",
  },
  {
    imageUrl: "/date02.png",
    productName: "Fusion",
  },
  {
    imageUrl: "/date03.png",
    productName: "Mini Bytes",
  },
  {
    imageUrl: "/date04.png",
    productName: "Honey",
  },
  {
    imageUrl: "/date05.png",
    productName: "Date Syrup",
  },
];
