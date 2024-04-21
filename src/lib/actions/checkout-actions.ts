"use server";
import { z } from "zod";
import { checkoutSchema } from "../schemas/user-schema";
import { OrderItem, RazorpayPaymentSuccess } from "../interface";
import Razorpay from "razorpay";
import products from "razorpay/dist/types/products";
import { Orders } from "razorpay/dist/types/orders";
import { IOrder, OrderModel } from "../models/order.model";
import { connectToDB } from "@/config/mongoose.config";
import crypto from "crypto";
import { Payment } from "../models/payment.model";
import { Product, ProductSchema } from "../models/products.model";
import { Coupon, CouponSchema } from "@/lib/models/coupon.model";
import { calculateDiscount } from "../utils";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY as string,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// additional will be removed in future
export const handlePaymentAction = async (
  userInfo: z.infer<typeof checkoutSchema>,
  orderInfo: OrderItem[],
  additional: { total: number; totalQuantity: number },
  _id: string
) => {
  let total = 0;
  let totalQuantity = 0;
  const products = [];
  await connectToDB();
  for (const item of orderInfo) {
    const product: ProductSchema | null = await Product.findById(item?._id);
    if (product) {
      const isQuantity =
        product?.quantity && product?.quantity >= item.quantity;
      if (!isQuantity) {
        return {
          error: `We're sorry, but ${product.product} is currently out of stock. Please check back later or contact customer support for more information.`,
        };
      }
      products.push({
        name: item.product.name,
        image: product.images[0],
        unit: item.product?.unit,
        quantity: item.quantity,
        total: item.product.price * item.quantity,
        subTotal: item.product.price * item.quantity,
        productId: product._id,
        price: item.product.price,
      });
      total = item.product.price * item.quantity + total;
      totalQuantity = totalQuantity + item.quantity;
    }
  }

  if (userInfo.coupon) {
    const coupon = await Coupon.findOne({ coupon: userInfo.coupon });
    if (coupon) {
      const discountAmount = +calculateDiscount(coupon, total);
      total = total - discountAmount;
    }
  }
  const payment_capture = 1;
  const amount = total * 100; // amount in paisa. In our case it's INR 1
  const currency = "INR";
  const options = {
    amount: amount.toString(),
    currency,
    payment_capture,
    notes: {
      name: userInfo.firstName,
      phone: userInfo.phone,
      email: userInfo.email,
    },
  };
  const order = await instance.orders.create(options);
  const formateOrderInfo = {
    ...userInfo,
    orderSummary: products,
    createdId: _id,
    orderId: order.id,
    total,
    totalQuantity,
  };

  const createdOrder = await OrderModel.create(formateOrderInfo);

  return { docOrderId: createdOrder?._id, ...order };
};

export const handleCheckoutAction = async (
  res: RazorpayPaymentSuccess,
  info: { createdId: string; orderId: string }
) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = res;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = await crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET as string)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  if (isAuthentic) {
    await connectToDB();
    const updateOrderPromise = OrderModel.findOneAndUpdate(
      { orderId: info.orderId },
      { paymentId: razorpay_payment_id, paymentStatus: "paid" }
    );
    const createPaymentPromise = Payment.create({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      createdId: info.createdId,
    });

    // Wait for both operations to complete
    const [order, payment] = await Promise.all([
      updateOrderPromise,
      createPaymentPromise,
    ]);
    if (payment && order)
      return { message: "Payment successful", order, payment };

    return { error: "Filed to create payment" };
  }
  return { error: "Payment failed!" };
};
