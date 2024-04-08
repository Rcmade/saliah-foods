"use server";

import { connectToDB } from "@/config/mongoose.config";
import { Product, ProductSchema } from "../models/products.model";

export const getProductsData = async (): Promise<ProductSchema[] | any[]> => {
  await connectToDB();
  const data = await Product.find({}).lean();
  
  return JSON.parse(JSON.stringify(data)) || [];
};
export const getFeaturedData = async (): Promise<ProductSchema[] | any[]> => {
  await connectToDB();
  //
  const data = await Product.find({ homePageType: "Featured" }).lean();
  
  return JSON.parse(JSON.stringify(data)) || [] as ProductSchema[];
};