"use server";
import { cookies } from "next/headers";
import otpService from "../service/otp.service";
import hashService from "../service/hash.service";
import sendService from "../service/send.service";
import { otpNewUserTemplate } from "../templates/email.template";
import { UserModel, UserSchema } from "../models/user.model";
import { connectToDB } from "@/config/mongoose.config";
import { otpLoginTemplate } from "../templates/login.opt.template";
import userService from "../service/user.service";
import { User } from "../interface";
import { OrderModel } from "../models/order.model";

// export const loginAction = async (token: string) => {
//   cookies().set("authorization", token, { secure: true });
// };

export const logoutAction = async () => {
  cookies().delete("authorization");
};

// for signup
export const sendOptAction = async (
  emailOrPhone: string,
  name: string,
  type: string = "email"
) => {
  if (!emailOrPhone || !name)
    return {
      error: `Please enter a valid ${type} and name`,
    };

  await connectToDB();

  const user = await UserModel.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
  });

  if (user) {
    return { error: "User already exists!" };
  }

  const otp = await otpService.createOtp();
  //Time to leave
  const ttl = 1000 * 60 * 10; // 10 minutes
  const expires = Date.now() + ttl;
  const data = `${emailOrPhone}.${name}.${otp}.${expires}`;
  const hash = await hashService.hashOtp(data);
  if (type === "phone") {
    await sendService.sendSMS(emailOrPhone, `Your OTP is ${otp}`);
    return { hash, message: "OTP sent successfully", expires };
  } else {
    await sendService.sendEmailService(
      "Email verification",
      emailOrPhone,
      otpNewUserTemplate(otp)
    );
    return { hash, message: "OTP sent successfully", expires };
  }
};

// for sighup
export const verifyOtpAction = async (
  otp: number,
  hash: string,
  emailOrPhone: string,
  name: string
) => {
  if (!otp || !hash || !emailOrPhone) {
    return { error: "All fields are required!" };
  }
  const [hashedOtp, expires] = hash.split(".");
  if (Date.now() > +expires) {
    return { error: "OTP expired!" };
  }
  // const data = `${email}.${+otp}.${+expires}`;
  const data = `${emailOrPhone}.${name}.${+otp}.${expires}`.trim();
  // console.log({ data });
  const isValid = await otpService.verifyOtp(hashedOtp, data);

  if (!isValid) {
    return { error: "Invalid OTP" };
  } else {
    await connectToDB();
    const formateData = {
      email: isNaN(parseFloat(emailOrPhone)) ? emailOrPhone : undefined,
      phone: isNaN(parseInt(emailOrPhone)) ? undefined : parseInt(emailOrPhone),
      name: name,
    };
    if (!formateData.email) {
      delete formateData.email;
    } else if (!formateData.phone) {
      delete formateData.phone;
    }
    const isUserExist = await UserModel.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (isUserExist) {
      return { error: "User already exists!" };
    }
    const user: UserSchema = await UserModel.create(formateData);
    if (user) {
      return { message: "You Are Verified", user };
    } else {
      return { error: "Failed to create user!" };
    }
  }
};

// for login
export const loginOptAction = async (
  emailOrPhone: string,
  type: string = "email"
) => {
  if (!emailOrPhone)
    return {
      error: `Please enter a valid ${type}`,
    };

  await connectToDB();

  const user = await UserModel.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
  });

  if (!user) {
    return { error: "User does not exists!" };
  }

  const otp = await otpService.createOtp();
  //Time to leave
  const ttl = 1000 * 60 * 10; // 10 minutes
  const expires = Date.now() + ttl;
  const data = `${emailOrPhone}.${otp}.${expires}`;
  const hash = await hashService.hashOtp(data);
  if (type === "phone") {
    await sendService.sendSMS(emailOrPhone, `Your OTP is ${otp}`);
    return { hash, message: "OTP sent successfully", expires };
  } else {
    await sendService.sendEmailService(
      "Email verification",
      emailOrPhone,
      otpNewUserTemplate(otp)
    );
    return { hash, message: "OTP sent successfully", expires };
  }
};

// login the user and set the cookies
export const loginAction = async (
  otp: number,
  hash: string,
  emailOrPhone: string
) => {
  if (!otp || !hash || !emailOrPhone) {
    return { error: "All fields are required!" };
  }
  const [hashedOtp, expires] = hash.split(".");
  if (Date.now() > +expires) {
    return { error: "OTP expired!" };
  }
  const data = `${emailOrPhone}.${+otp}.${expires}`;
  const isValid = await otpService.verifyOtp(hashedOtp, data);
  if (!isValid) {
    return { error: "Invalid OTP" };
  } else {
    await connectToDB();
    const user = await UserModel.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (user) {
      const token = await userService.signJWT(user);
      cookies().set("authorization", token, { secure: true });
      const sendData = { message: "You Are Verified", user, token };
      return JSON.parse(JSON.stringify(sendData));
    } else {
      return { error: "Failed to login!" };
    }
  }
};

// send phone otp token
export const sendOtp = async (phone: string, name = "") => {
  if (!phone) {
    return { error: "Phone number is required!" };
  }
  const otp = await otpService.createOtp();
  //Time to leave
  const ttl = 1000 * 60 * 10; // 10 minutes
  const expires = Date.now() + ttl;
  const data = `${phone}.${otp}.${expires}`.trim();
  const hash = await hashService.hashOtp(data);
  // console.log({ data, hash });
  const sms = await sendService.sendSMS(phone, `Your OTP is ${otp}`);
  if (sms) {
    return { hash, message: "OTP sent successfully", expires };
  } else {
    return { error: "Error sending OTP" };
  }
};

// validate and create or update user
export const createOrUpdateUser = async (
  otp: number,
  hash: string,
  phone: string
) => {
  if (!otp || !hash || !phone) {
    return { error: "All fields are required!" };
  }
  const [hashedOtp, expires] = hash.split(".");
  if (Date.now() > +expires) {
    return { error: "OTP expired!" };
  }
  const data = `${phone}.${otp}.${expires}`.trim();
  // console.log({ data, hashedOtp });
  const isValid = await otpService.verifyOtp(hashedOtp, data);
  if (!isValid) {
    return { error: "Invalid OTP" };
  } else {
    await connectToDB();
    let user;
    user = await UserModel.findOne({
      phone,
    });
    if (user) {
      const token = await userService.signJWT(user);
      cookies().set("authorization", token, { secure: true });
      return {
        message: "Welcome back! We're glad to see you again.",
        user,
        token,
      };
    } else {
      user = await UserModel.create({
        phone: phone,
      });
      const token = await userService.signJWT(user);
      cookies().set("authorization", token, { secure: true });
      return { message: "Your account has been created", user, token };
    }
  }
};

// update user
export const updateUser = async (finder: User, updateData: User) => {
  if (!finder.email && !finder.phone) {
    return { error: "Email or phone is required!" };
  }

  await connectToDB();
  const user = await UserModel.findOne({
    $or: [{ email: finder.email }, { phone: finder.phone }],
  });

  if (!user) {
    return { error: "User not found!" };
  } else {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: user._id },
      { ...updateData },
      { new: true }
    );
    return { message: "User updated successfully", user: updatedUser };
  }
};

export const userOrders = async (userId: string) => {
  if (!userId) {
    return { error: "User _id is required!, Please logged in" };
  }
  await connectToDB();
  // const orders
  const order = await OrderModel.find({ createdId: userId });
  return order;
};
