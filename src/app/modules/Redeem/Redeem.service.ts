import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";

const createIntoDb = async (data: any) => {
  const { bookId: bookId, point } = data;

  // Step 1: Check existence of all books
  const foundBooks = await prisma.book.findMany({
    where: {
      id: {
        in: bookId,
      },
    },
    select: {
      id: true,
    },
  });

  const foundBookIds = foundBooks.map((book) => book.id);
  const missingBookIds = bookId.filter(
    (id: string) => !foundBookIds.includes(id)
  );

  if (missingBookIds.length > 0) {
    throw new ApiError(
      404,
      `Books not found with IDs: ${missingBookIds.join(", ")}`
    );
  }

  // Step 2: Prepare data
  const preparedData = bookId.map((id: string) => ({
    bookId: id,
    point,
  }));

  // Step 3: Insert into DB
  const res = await prisma.redeem.createMany({
    data: preparedData,
  });

  return res;
};

// const getListFromDb = async (userId: string) => {
//   // Get all purchased book IDs
//   const purchasedBooks = await prisma.purchase.findMany({
//     where: { userId },
//     select: {
//       bookId: true,
//     },
//   });

//   const purchasedBookIds = purchasedBooks.map((book) => book.bookId);

//   // Build exclusion condition
//   const excludeCondition =
//     purchasedBookIds.length > 0
//       ? { bookId: { notIn: purchasedBookIds } }
//       : {};

//   // Fetch redeemable books not purchased
//   const result = await prisma.redeem.findMany({
//     where: excludeCondition,
//     select: {
//       id: true,
//       point: true,
//       book: {
//         select: {
//           id: true,
//           bookName: true,
//           coverImage: true,
//         },
//       },
//     },
//   });

//   return result;
// };

const getListFromDb = async (userId: string) => {
  // Get all purchased book IDs for the user
  const purchasedBooksList = await prisma.purchase.findMany({
    where: { userId },
    select: {
      bookId: true,
    },
  });

  // Filter out any null values from the bookIds
  const purchasedBookIds = purchasedBooksList
    .map((book) => book.bookId)
    .filter((bookId) => bookId !== null) as string[]; // Cast to string[]

  // Fetch redeemable books not purchased by the user
  const result = await prisma.redeem.findMany({
    where: {
      bookId: {
        notIn: purchasedBookIds.length > 0 ? purchasedBookIds : undefined,
      },
    },
    select: {
      id: true,
      point: true,
      book: {
        select: {
          id: true,
          bookName: true,
          coverImage: true,
        },
      },
    },
  });

  return result;
};



const getByIdFromDb = async (id: string) => {
  const result = await prisma.redeem.findUnique({
    where: { id },
    select: { id: true, point: true, book: true },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "redeem not found");
  }
  return result;
};

const updateIntoDb = async (id: string, data: any) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const result = await prisma.redeem.update({
      where: { id },
      data,
    });
    return result;
  });

  return transaction;
};

const deleteItemFromDb = async (id: string) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const deletedItem = await prisma.redeem.delete({
      where: { id },
    });
    return deletedItem;
  });

  return transaction;
};
const redeemBookByPoint = async (userId: string, redeemId: string) => {
  const isExistRedeem = await prisma.redeem.findFirst({
    where: { id: redeemId },
  });
  if (!isExistRedeem) {
    throw new ApiError(httpStatus.NOT_FOUND, "Redeem not found");
  }
  const userExist = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  if (userExist.point < isExistRedeem.point) {
    throw new ApiError(
      httpStatus.NOT_ACCEPTABLE,
      `Oops! You need more points. Minimum required: ${isExistRedeem.point}.`
    );
  }
  const result = await prisma.purchase.create({
    data: {
      userId,
      bookId: isExistRedeem.bookId,
    },
  });
  // deduct point from user
  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: { point: userExist.point - isExistRedeem.point },
  });
  return result;
};
export const redeemService = {
  createIntoDb,
  getListFromDb,
  getByIdFromDb,
  updateIntoDb,
  deleteItemFromDb,
  redeemBookByPoint,
};
