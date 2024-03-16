import React from "react";
import ProductListProvider from "./ProductListProvider";
import axios from "axios";
import { getProductsData } from "@/lib/actions/product-actions";

export const fetchCache = "force-no-store";
export const dynamic = "force-dynamic";
const ProductListPage = async () => {
  const data = await getProductsData();
  return <ProductListProvider data={data} />;
};

export default ProductListPage;
