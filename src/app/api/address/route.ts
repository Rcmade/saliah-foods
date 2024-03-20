import { NextApiResponse } from "next";
import { connectToDB } from "@/config/mongoose.config";
import { AddressModel } from "@/lib/models/address.model";
import { AddressT } from "@/lib/types";
import { NextRequest } from "next/server";

// Create an Address
async function POST(req: Request, res: NextApiResponse) {
  await connectToDB();
  try {
    const data = (await req.json()) as Partial<AddressT>;
    if (data?._id) {
      const isExist = await AddressModel.findById(data?._id);
      if (isExist) {
        const updatedAddress = await AddressModel.findByIdAndUpdate(
          data?._id,
          data,
          {
            new: true,
          }
        );
        if (updatedAddress) {
          return Response.json({
            data: updatedAddress,
            message: "Address updated successfully",
          });
        } else {
          return Response.json({ error: "Address not found" });
        }
      }
    } else {
      const newAddress = new AddressModel(data);
      await newAddress.save();
      return Response.json(
        {
          data: newAddress,
          message: "Address created successfully",
        },
        {
          status: 201,
        }
      );
    }
  } catch (error) {
    return Response.json({ error: "Internal Server Error" });
  }
}

// Get an Address (Example of reading by ID, assuming ID is passed as a query parameter)
const GET = async (req: NextRequest, res: any) => {
  await connectToDB();
  try {
    const createdId = req.nextUrl.searchParams.get("createdId");
    const address = await AddressModel.find({ createdId }).sort({
      createdAt: -1,
    });
    if (!address) {
      return Response.json({ error: "Address not found" });
    }
    return Response.json({ data: address });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" });
  }
};

// Delete an Address
async function DELETE(req: any, res: any) {
  await connectToDB();

  try {
    const { id } = req.query;
    const deletedAddress = await AddressModel.findByIdAndDelete(id);
    if (!deletedAddress) {
      return res.status(404).json({ error: "Address not found" });
    }
    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export { POST, GET, DELETE };
