import { connectToDB } from "@/config/mongoose.config";
import { OrderModel } from "@/lib/models/order.model";

export const DELETE = async (req: Request, res: Response) => {
  await connectToDB();
  const { orderId, createdId } = await req.json();
  const deleteProduct = await OrderModel.findOneAndDelete({
    orderId,
    createdId,
    paymentStatus: "Pending",
  });
  return Response.json({ message: "Payment cancelled" });
};
