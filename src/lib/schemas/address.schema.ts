import { z } from "zod";
export const AddressSchema = z.object({
  apartment: z.string().min(1, { message: "This field has to be filled." }),
  city: z.string().min(1, { message: "This field has to be filled." }),
  phone: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .max(10, "Number must be 10 digits"),
  // country: z.string().min(1, { message: "This field has to be filled." }),
  state: z.string().min(1, { message: "This field has to be filled." }),
  pinCode: z.union([
    z.string().min(1, { message: "This field has to be filled." }),
    z.number().min(1, { message: "This field has to be filled." }),
  ]),
  streetAddress: z.string().min(1, { message: "This field has to be filled." }),
  createdId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
