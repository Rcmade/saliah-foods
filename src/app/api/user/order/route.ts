import { connectToDB } from "@/config/mongoose.config";
import { OrderModel } from "@/lib/models/order.model";

export const POST = async (req: Request, res: Response) => {
  const body = await req.json();

  if (!body.userId) {
    return Response.json({ error: "User _id not found!, please login" });
  }
  await connectToDB();
  const order = await OrderModel.find({
    createdId: body.userId,
    paymentStatus: "paid",
  });
  return Response.json(order);
};
