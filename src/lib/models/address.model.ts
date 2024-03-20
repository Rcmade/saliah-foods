import { Schema, model } from "mongoose";
const mongoose = require("mongoose");

export interface IAddress extends Document {
  createdId: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  pinCode: number;
  streetAddress: string;
  apartment?: string;
}

const AddressSchema = new Schema<IAddress>(
  {
    phone: {
      type: String,
      required: true,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pinCode: {
      type: Number,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    apartment: {
      type: String,
      required: false,
    },

    createdId: { ref: "User", type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

export const AddressModel =
  mongoose.models?.Address || mongoose.model("Address", AddressSchema);
