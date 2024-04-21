import { z } from "zod";
import { AddressSchema } from "../schemas/address.schema";

export type NotificationType =
  | "WELCOME"
  | "CHANGE_OF_STOCK"
  | "LOWEST_PRICE"
  | "THRESHOLD_MET";

export type EmailContent = {
  subject: string;
  body: string;
};

export type TransformedOrderDataType = {
  name: string;
  createdAt: string;
  total: number;
  status: string;
  orderId: string;
  _id: string;
  image: string;
  paymentStatus: string;
};

export type AddressT = z.infer<typeof AddressSchema> & {
  _id: string;
};
