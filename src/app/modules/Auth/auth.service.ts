import * as bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";
import { PhoneNumber } from "./../../../../node_modules/twilio/lib/interfaces.d";

import { UserStatus } from "@prisma/client";
import crypto from "crypto";
import httpStatus from "http-status";
import { twilioSender } from "../../../shared/twilloSender";
import { emailSender } from "../../../shared/emailSender";
// user login
const loginUser = async (payload: {
  phoneNumber?: string;
  password: string;
  email?: string;
  fcmToken?: string;
}) => {
  let userData;

  if (payload.phoneNumber) {
    // If phoneNumber is provided, search by phoneNumber
    userData = await prisma.user.findFirst({
      where: {
        phoneNumber: payload.phoneNumber,
      },
    });
  } else if (payload.email) {
    // If email is provided, search by email
    userData = await prisma.user.findFirst({
      where: {
        email: payload.email,
      },
    });
  }

  if (!userData) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User not found with this phone number or email"
    );
  }

  if (userData.status !== UserStatus.ACTIVE) {
    throw new ApiError(httpStatus.FORBIDDEN, "Your account is not active");
  }

  if (userData.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "You are Blocked by Admin");
  }

  if (!userData.password) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Password not set! When you registered, you should have set a password"
    );
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password!
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password incorrect!");
  }

  if (payload.fcmToken) {
    await prisma.user.update({
      where: { id: userData.id },
      data: { fcmToken: payload.fcmToken },
    });
  }

  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email || userData.phoneNumber, // Using email if available, else phone number
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return { token: accessToken };
};

// get user profile
const getMyProfile = async (userToken: string) => {
  const decodedToken = jwtHelpers.verifyToken(
    userToken,
    config.jwt.jwt_secret!
  );

  const userProfile = await prisma.user.findUnique({
    where: {
      id: decodedToken.id,
    },
    select: {
      id: true,
      fullName: true,
      password: true,
      point: true,
      isDeleted: true,
      role: true,
      country:true, 
      location: true,
      purchaseCount: true,
      profileImage: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!userProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, "User profile not found");
  }

  return userProfile;
};

// change password

const changePassword = async (
  userToken: string,
  newPassword: string,
  oldPassword: string
) => {
  const decodedToken = jwtHelpers.verifyToken(
    userToken,
    config.jwt.jwt_secret!
  );

  const user = await prisma.user.findUnique({
    where: { id: decodedToken?.id },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user?.password!);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect old password");
  }
  console.log(config.bcrypt_salt_rounds);
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)!
  );

  const result = await prisma.user.update({
    where: {
      id: decodedToken.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  return { message: "Password changed successfully" };
};
const forgotPassword = async (payload: { phoneNumber?: string; email?: string }) => {
  let userData;

  if (payload.phoneNumber) {
    userData = await prisma.user.findFirstOrThrow({
      where: {
        phoneNumber: payload.phoneNumber,
      },
    });
  } else if (payload.email) {
    userData = await prisma.user.findFirstOrThrow({
      where: {
        email: payload.email,
      },
    });
  }

  const otp = Number(crypto.randomInt(1000, 9999));
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
console.log(userData?.phoneNumber, payload.phoneNumber);
  if (userData) {
    if (userData.phoneNumber && payload.phoneNumber && userData.phoneNumber === payload.phoneNumber) {
      await twilioSender(userData.phoneNumber, otp.toString());
      await prisma.user.update({
        where: { id: userData.id },
        data: {
          otp: otp,
          expirationOtp: otpExpires,
          // status: UserStatus.INACTIVE,
        },
      });
      return { message: "Reset password OTP sent to your phone successfully", otp };
    }

    if (userData.email && payload.email && userData.email === payload.email) {
      const html = `
        <html>
          <head>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                background-color: #4CAF50;
                color: white;
                text-align: center;
                padding: 15px;
                border-radius: 8px 8px 0 0;
              }
              .content {
                padding: 20px;
                font-size: 16px;
                color: #333;
                line-height: 1.6;
              }
              .otp-box {
                font-size: 24px;
                font-weight: bold;
                background-color: #f0f0f0;
                padding: 10px;
                text-align: center;
                border-radius: 4px;
                color: #4CAF50;
                margin-top: 20px;
              }
              .footer {
                font-size: 14px;
                text-align: center;
                color: #777;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Your OTP for Registration</h2>
              </div>
              <div class="content">
                <p>Hi there,</p>
                <p>Thank you for registering with us! Please use the OTP below to complete your registration process:</p>
                <div class="otp-box">
                  <strong>${otp}</strong>
                </div>
                <p>This OTP will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
                <p>Best regards,</p>
                <p><strong>MFM EBOOKS</strong></p>
              </div>
            </div>
          </body>
        </html>
      `;
      await emailSender(payload.email, html, "Your OTP for Registration");
      await prisma.user.update({
        where: { id: userData.id },
        data: {
          otp: otp,
          expirationOtp: otpExpires,
        },
      });
      return { message: "Reset password OTP sent to your email successfully", otp };
    }
  }

  throw new ApiError(httpStatus.BAD_REQUEST, "Phone number or email is required");
};


const resendOtp = async (payload: { phoneNumber?: string; email?: string }) => {
  const otp = crypto.randomInt(1000, 9999);
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  let user;

  if (payload.phoneNumber) {
    // Search by phone number
    user = await prisma.user.findFirst({
      where: { phoneNumber: payload.phoneNumber },
    });
  } else if (payload.email) {
    // Search by email if phone number is not provided
    user = await prisma.user.findFirst({
      where: { email: payload.email },
    });
  }

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found with the provided phone number or email!");
  }

  if (user.phoneNumber) {
    // If phone number is found, resend OTP via phone
    await twilioSender(user.phoneNumber, otp.toString());
  } else if (user.email) {
    // If email is found, resend OTP via email
    const html = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              background-color: #4CAF50;
              color: white;
              text-align: center;
              padding: 15px;
              border-radius: 8px 8px 0 0;
            }
            .content {
              padding: 20px;
              font-size: 16px;
              color: #333;
              line-height: 1.6;
            }
            .otp-box {
              font-size: 24px;
              font-weight: bold;
              background-color: #f0f0f0;
              padding: 10px;
              text-align: center;
              border-radius: 4px;
              color: #4CAF50;
              margin-top: 20px;
            }
            .footer {
              font-size: 14px;
              text-align: center;
              color: #777;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Your OTP for Registration</h2>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Here is your OTP:</p>
              <div class="otp-box">
                <strong>${otp}</strong>
              </div>
              <p>This OTP will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
              <p>Best regards,</p>
              <p><strong>MFM EBOOKS</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;
    await emailSender(user.email, html, "Your OTP for Registration");
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      otp: Number(otp),
      expirationOtp: otpExpires,
    },
  });

  if (!updatedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "Can't update OTP");
  }

  return { message: "OTP resent successfully", otp: Number(otp) };
};

const verifyForgotPasswordOtp = async (payload: { phoneNumber?: string; email?: string; otp: number }) => {
  let user;

  if (payload.phoneNumber) {
    user = await prisma.user.findFirst({
      where: { phoneNumber: payload.phoneNumber },
    });
  } else if (payload.email) {
    user = await prisma.user.findFirst({
      where: { email: payload.email },
    });
  }

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  const trimmedOtp = payload.otp?.toString().trim();

  if (!trimmedOtp || isNaN(Number(trimmedOtp))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP format");
  }

  if (String(user.otp) !== trimmedOtp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  if (user.expirationOtp && user.expirationOtp < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP expired");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      status: UserStatus.ACTIVE,
      otp: null,
      expirationOtp: null,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      id: user.id,
      email: user.email || user.phoneNumber, 
      role: user.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return { message: "OTP verification successful", token: accessToken };
};


// reset password
const resetPassword = async (payload: { password: string; phoneNumber?: string; email?: string }) => {
  let user;

  if (payload.phoneNumber) {
    user = await prisma.user.findFirst({
      where: { phoneNumber: payload.phoneNumber },
    });
  } else if (payload.email) {
    user = await prisma.user.findFirst({
      where: { email: payload.email },
    });
  }

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  const hashedPassword = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds));

  const result = await prisma.user.updateMany({
    where: { id: user.id },
    data: {
      password: hashedPassword, // Update with the hashed password
      otp: null, // Clear the OTP
      expirationOtp: null, // Clear OTP expiration
    },
  });

  if (result.count === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password reset failed");
  }

  return { message: "Password reset successfully" };
};

export const AuthServices = {
  loginUser,
  getMyProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  resendOtp,
  verifyForgotPasswordOtp,
};
