import ApiError from "../../../errors/ApiErrors";
import { IUser, IUserFilterRequest } from "./user.interface";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma, User, UserStatus } from "@prisma/client";
import { userSearchAbleFields } from "./user.costant";
import httpStatus from "http-status";
import e, { Request } from "express";
import { fileUploader } from "../../../helpars/fileUploader";
import { twilioSender } from "../../../shared/twilloSender";
import crypto from "crypto";
import * as bcrypt from "bcrypt";
import config from "../../../config";
import Api from "twilio/lib/rest/Api";
import prisma from "../../../shared/prisma";
import { ObjectId } from "mongodb";
import { emailSender } from "../../../shared/emailSender";
// Create a new user in the database.
const createUserIntoDb = async (payload: User) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
const html=          `
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
  if (payload.phoneNumber) {
    const existingUser = await prisma.user.findFirst({
      where: {
        phoneNumber: payload.phoneNumber,
      },
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        profileImage: true,
        role: true,
        status: true,
        otp: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (existingUser) {
      if (existingUser.status === UserStatus.INACTIVE) {
        await twilioSender(payload.phoneNumber, otp);
        return await prisma.user.update({
          where: { id: existingUser.id },
          data: { otp: Number(otp), expirationOtp: otpExpires },
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            profileImage: true,
            role: true,
            status: true,
            otp: true,
            createdAt: true,
            updatedAt: true,
          },
        });
      } else {
        throw new ApiError(409, "User already exists with this phone number.");
      }
    } else {
      const result = await prisma.user.create({
        data: { ...payload, otp: Number(otp), expirationOtp: otpExpires },
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
          profileImage: true,
          role: true,
          status: true,
          otp: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      await twilioSender(payload.phoneNumber, otp);
      return result;
    }
  } else if (payload.email) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        status: true,
        fullName: true,
        phoneNumber: true,
        profileImage: true,
      },
    });

    if (existingUser) {
      if (existingUser.status === UserStatus.INACTIVE) {
        await emailSender(
          payload.email,
html,
          "Your OTP for registration"
        );

        return await prisma.user.update({
          where: { id: existingUser.id },
          data: { otp: Number(otp), expirationOtp: otpExpires },
          select: {
            id: true,
            fullName: true, 
            phoneNumber: true,
            email: true,
            profileImage: true,
            role: true,
            status: true,
            otp: true,
            createdAt: true,
            updatedAt: true,
          },
        });
      }
    }

    const result = await prisma.user.create({
      data: { ...payload, otp: Number(otp), expirationOtp: otpExpires },
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        email: true,
        profileImage: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    await emailSender(
      payload.email,
      html,
      "Your OTP for registration"
    );
    return result;
  }
};

// reterive all users from the database also searcing anf filetering
const getUsersFromDb = async (
  params: IUserFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditons: Prisma.UserWhereInput = { AND: andCondions };

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      fullName: true,
      isDeleted: true,
      profileImage: true,
      phoneNumber: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const total = await prisma.user.count({
    where: whereConditons,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// update profile by user won profile uisng token or email and id
const updateProfile = async (req: Request) => {
  console.log(req.file, req.body.data);
  const file = req.file;
  const stringData = req.body.data;
  let image;
  let parseData;
  const existingUser = await prisma.user.findFirst({
    where: {
      id: req.user.id,
    },
  });
  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }
  if (file) {
    image = (await fileUploader.uploadToCloudinary(file)).Location;
  }
  if (stringData) {
    parseData = JSON.parse(stringData);
  }
  if (parseData.password) {
    parseData.password = await bcrypt.hash(
      parseData.password,
      Number(config.bcrypt_salt_rounds)
    );
  }
  if (
    parseData.phoneNumber &&
    parseData.phoneNumber !== existingUser.phoneNumber
  ) {
    const existingPhoneUser = await prisma.user.findFirst({
      where: {
        phoneNumber: parseData.phoneNumber,
      },
    });
    if (existingPhoneUser) {
      throw new ApiError(httpStatus.CONFLICT, "Phone number already exists.");
    }
  }
  const result = await prisma.user.update({
    where: {
      id: existingUser.id, // Ensure `existingUser.id` is valid and exists
    },
    data: {
      fullName: parseData.fullName || existingUser.fullName,
      phoneNumber: parseData.phoneNumber || existingUser.phoneNumber,
      profileImage: image || existingUser.profileImage,
      location: parseData.location || existingUser.location,
      country: parseData.country || existingUser.country,
      password: parseData.password || existingUser.password,
      updatedAt: new Date(), // Assuming your model has an `updatedAt` field
    },
    select: {
      id: true,
      fullName: true,
      profileImage: true,
      country:true,
      phoneNumber: true,
    },
  });

  return result;
};

// update user data into database by id fir admin
const updateUserIntoDb = async (payload: IUser, id: string) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  if (!userInfo)
    throw new ApiError(httpStatus.NOT_FOUND, "User not found with id: " + id);

  const result = await prisma.user.update({
    where: {
      id: userInfo.id,
    },
    data: payload,
    select: {
      id: true,
      fullName: true,

      phoneNumber: true,
      profileImage: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!result)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update user profile"
    );

  return result;
};

const changeNotificationStatus = async (userId: string) => {
  const isExistUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const updateUser = await prisma.user.update({
    where: { id: isExistUser.id },
    data: { isNotification: isExistUser.isNotification ? false : true },
    select: { id: true, isNotification: true },
  });
  return updateUser;
};

const userBlock = async (id: string) => {
  const isExistUser = await prisma.user.findFirst({ where: { id } });
  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const result = await prisma.user.update({
    where: { id: isExistUser.id },
    data: { isDeleted: isExistUser.isDeleted ? false : true },
    select: { id: true, isDeleted: true },
  });
  return result;
};

const deleteUsersWithRelations = async (userIds: string[]) => {
  console.log("Deleting users with IDs:", userIds);

  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new Error("Provide at least one user ID to delete.");
  }

  const objectIds = userIds.map((id) => new ObjectId(id));

  try {
    // 1. Delete favorites by users
    await prisma.favorite.deleteMany({
      where: {
        favoritedById: { in: userIds },
      },
    });

    // 2. Delete notifications sent by users
    await prisma.notification.deleteMany({
      where: {
        senderId: { in: userIds },
      },
    });

    // 3. Delete notifications received by users
    await prisma.notification.deleteMany({
      where: {
        receiverId: { in: userIds },
      },
    });

    // 4. Delete purchases
    await prisma.purchase.deleteMany({
      where: {
        userId: { in: userIds },
      },
    });

    // 5. Delete the users themselves
    const result = await prisma.user.deleteMany({
      where: {
        id: { in: userIds },
      },
    });

    console.log(`🧹 Deleted ${result.count} users and all their related data.`);
    return { success: true, deletedCount: result.count };
  } catch (error) {
    console.error("❌ Failed to delete users and related data:", error);
    throw new Error("Failed to delete users and related data.");
  }
};

export const userService = {
  createUserIntoDb,
  getUsersFromDb,
  updateProfile,
  updateUserIntoDb,
  changeNotificationStatus,
  deleteUsersWithRelations,
  userBlock,
};
