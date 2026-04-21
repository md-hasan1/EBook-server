import { Point, UserRole, UserStatus } from "@prisma/client";

import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { JwtPayload } from "jsonwebtoken";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";

const createIntoDb = async (data: { bookId: string }, user: JwtPayload) => {
  // Check if book exists
  const isExistBook = await prisma.book.findUnique({
    where: { id: data.bookId },
    select: { id: true },
  });
  if (!isExistBook) {
    throw new ApiError(httpStatus.NOT_FOUND, "Book not found");
  }

  // Check if user exists
  const isExistUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, purchaseCount: true },
  });
  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const isAlreadyBuy = await prisma.purchase.findFirst({
    where: { userId: user.id, bookId: data.bookId },
  });

  if (isAlreadyBuy) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, "You already buy this book");
  }
  // Get next purchase count
  const nextPurchaseCount = isExistUser.purchaseCount + 1;

  // Find matching point config
  const pointToAdd = await prisma.point.findFirst({
    where: { bookNumber: nextPurchaseCount },
    select: { point: true },
  });

  // Start transaction for atomic operations
  await prisma.$transaction(async (tx) => {
    // Create purchase entry
    await tx.purchase.create({
      data: {
        userId: user.id,
        bookId: data.bookId,
      },
    });
    await tx.book.update({
      where: { id: data.bookId },
      data: { perseCount: { increment: 1 } },
    });
    // Update user with point (if applicable) and purchaseCount
    await tx.user.update({
      where: { id: user.id },
      data: {
        purchaseCount: { increment: 1 },
        ...(pointToAdd && {
          point: { increment: pointToAdd.point },
        }),
      },
    });
  });

  // Return updated user
  return await prisma.user.findUnique({ where: { id: user.id } });
};

const getListFromDb = async (
  user: JwtPayload,
  query: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const bookFilter: any = {};

  if (query.type) {
    bookFilter.type = query.type.toUpperCase();
  }

  const result = await prisma.purchase.findMany({
    where: {
    ...(user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN
        ? {}
        : {
            userId: user.id,
          }),
      book: bookFilter,
    },
    orderBy: [{ isPin: "desc" }, { updatedAt: "asc" }],
    skip,
    take: limit,
    select: {
      id: true,
      isPin: true,
      createdAt: true,
      book: {
        select: {
          id: true,
          bookName: true,
          writerName: true,
          category: true,
          totalPages: true,
          totalSize: true,
          length: true,
          language: true,
          formate: true,
          publisher: true,
          releaseDate: true,
          perseCount: true,
          price: true,
          productId: true,
          description: true,
          type: true,
          coverImage: true,
          file: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      user: { select: { fullName: true } },
    },
  });

  const total = await prisma.purchase.count({
    where: {
      ...(user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN
        ? {}
        : {
            userId: user.id,
          }),
      book: bookFilter,

    },
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDb = async (id: string) => {
  const result = await prisma.purchase.findUnique({ where: { id } });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "purchase not found");
  }
  return result;
};

const updateIntoDb = async (id: string, data: any) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const result = await prisma.purchase.update({
      where: { id },
      data,
    });
    return result;
  });

  return transaction;
};

const deleteItemFromDb = async (id: string) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const deletedItem = await prisma.purchase.delete({
      where: { id },
    });

    // Add any additional logic if necessary, e.g., cascading deletes
    return deletedItem;
  });

  return transaction;
};

const pinPurchaseBook = async (id: string) => {
  console.log(id);
  const isExistPusre = await prisma.purchase.findFirst({ where: { id } });
  if (!isExistPusre) {
    throw new ApiError(httpStatus.NOT_FOUND, "Book Not Found");
  }
  const result = await prisma.purchase.update({
    where: { id },
    data: {
      isPin: isExistPusre.isPin ? false : true,
    },
  });

  return result;
};
export const purchaseService = {
  createIntoDb,
  getListFromDb,
  getByIdFromDb,
  updateIntoDb,
  deleteItemFromDb,
  pinPurchaseBook,
};
