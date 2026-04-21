import { serviceAccount } from './../Notification/firebaseService';
import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import { Request } from "express";
import { fileUploader } from "../../../helpars/fileUploader";
import { IBookFilterRequest } from "./Book.interface";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { BookType, Prisma } from "@prisma/client";
import { bookSearchAbleFields } from "./Book.constant";
import ApiError from "../../../errors/ApiErrors";

const createIntoDb = async (req: Request) => {
  const stringify = req.body.data;
  const parsedData = JSON.parse(stringify);
  const { file, cover } = req.files as {
    file: Express.Multer.File[];
    cover: Express.Multer.File[];
  };
  // const fileData = file[0];
  const fileData = file[0];
  const coverData = cover[0];
  const [uploadedFileUrl, uploadedCoverUrl] = await Promise.all([
    fileUploader.uploadToCloudinary(fileData),
    fileUploader.uploadToCloudinary(coverData),
  ]);
  if (parsedData.type) {
    parsedData.type = parsedData.type.toUpperCase();
  }
  const result = await prisma.book.create({
    data: {
      ...parsedData,
      file: uploadedFileUrl.Location,
      coverImage: uploadedCoverUrl.Location,
    },
  });
  return result;
};

const getListFromDb = async (
  params: IBookFilterRequest,
  options: IPaginationOptions,
  userId: string // pass current user's ID here
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.BookWhereInput[] = [{ isDeleted: false }];

  if (searchTerm) {
    andConditions.push({
      OR: bookSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (filterData?.type) {
    const normalizedType =
      filterData.type.toUpperCase() as keyof typeof BookType;
    filterData.type = BookType[normalizedType];
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.BookWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.book.findMany({
    where: whereConditions,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    skip,
    take: limit,
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
      price: true,
      perseCount: true,
      description: true,
      type: true,
      coverImage: true,
      file: true,
      createdAt: true,
      updatedAt: true,
      favorite: {
        where: {
          favoritedById: userId,
        },
        select: {
          id: true,
        },
      },
    },
  });

  // Now map to add isFavorite flag
  const booksWithIsFavorite = result.map(({ favorite, ...book }) => ({
    ...book,
    isFavorite: favorite.length > 0,
  }));

  const total = await prisma.book.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: booksWithIsFavorite,
  };
};

const getListName = async (
  params: IBookFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.BookWhereInput[] = [{ isDeleted: false }];

  // Add search capability (assuming bookSearchAbleFields exists)
  if (searchTerm) {
    andConditions.push({
      OR: bookSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (filterData?.type) {
    const normalizedType =
      filterData.type.toUpperCase() as keyof typeof BookType;
    filterData.type = BookType[normalizedType];
  }

  // Add direct filters (like genre, author, etc.)
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.BookWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.book.findMany({
    where: whereConditions,

    // skip,
    // take: limit,
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
      bookName: true,
    },
  });

  const total = await prisma.book.count({
    where: whereConditions,
  });

  return {
    // meta: {
    //   page,
    //   limit,
    //   total,
    // },
    data: result,
  };
};

const getByIdFromDb = async (id: string, userId: string) => {
  const result = await prisma.book.findUnique({
    where: { id, isDeleted: false },
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
      purchase: {
        where: {
          userId,
          bookId: id,
        },
      },
      favorite: {
        where: {
          favoritedById: userId,
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "book not found");
  }

  // Destructure out `favorite` and inject `isFavorite`
  const { favorite, purchase, ...bookData } = result;

  return {
    ...bookData,
    isFavorite: favorite.length > 0,
    isPayment: purchase.length > 0,
  };
};

const updateIntoDb = async (id: string, req: Request) => {
  const stringify = req.body.data;
  const parsedData = JSON.parse(stringify);
  const { file, cover } = req.files as {
    file?: Express.Multer.File[];
    cover?: Express.Multer.File[];
  };

  const updateData: any = {
    ...parsedData,
  };

  const isExistBook = await prisma.book.findUnique({
    where: { id, isDeleted: false },
  });
  if (!isExistBook) {
    throw new ApiError(httpStatus.NOT_FOUND, "book not found");
  }
  // Optional file updates
  if (file && file[0]) {
    const uploadedFile = await fileUploader.uploadToCloudinary(file[0]);
    updateData.file = uploadedFile.Location;
  }

  if (cover && cover[0]) {
    const uploadedCover = await fileUploader.uploadToCloudinary(cover[0]);
    updateData.coverImage = uploadedCover.Location;
  }

  // Normalize enum type if needed
  if (parsedData.type) {
    updateData.type = parsedData.type.toUpperCase();
  }

  const result = await prisma.book.update({
    where: {
      id: id, // 🔥 Make sure `id` is present in body!
    },
    data: {
      bookName: updateData.bookName || isExistBook.bookName,
      writerName: updateData.writerName || isExistBook.writerName,
      category: updateData.category || isExistBook.category,
      productId: updateData.productId || isExistBook.productId,
      totalPages: updateData.totalPages ?? isExistBook.totalPages,
      totalSize: updateData.totalSize || isExistBook.totalSize,
      length: updateData.length || isExistBook.length,
      language: updateData.language || isExistBook.language,
      formate: updateData.formate || isExistBook.formate,
      publisher: updateData.publisher || isExistBook.publisher,
      releaseDate: updateData.releaseDate || isExistBook.releaseDate,
      price: updateData.price ?? isExistBook.price,
      description: updateData.description || isExistBook.description,
      isRecommended: updateData.isRecommended ?? isExistBook.isRecommended,
      coverImage: updateData.coverImage || isExistBook.coverImage,
      file: updateData.file || isExistBook.file,
      perseCount: updateData.perseCount ?? isExistBook.perseCount,
      type: updateData.type || isExistBook.type,
    },
  });

  return result;
};

const deleteItemFromDb = async (id: string) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const deletedItem = await prisma.book.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    // Add any additional logic if necessary, e.g., cascading deletes
    return deletedItem;
  });

  return transaction;
};
const addRecommended = async (bookIds: string[]) => {
  const result = await prisma.book.updateMany({
    where: {
      id: {
        in: bookIds,
      },
    },
    data: {
      isRecommended: true,
    },
  });
  return result;
};
const getRecommended = async (userId: string, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const result = await prisma.book.findMany({
    where: { isRecommended: true, isDeleted: false },
    include: {
      favorite: { where: { favoritedById: userId }, select: { id: true } },
    },
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
  });

  const total = await prisma.book.count({
    where: { isRecommended: true, isDeleted: false },
  });

  const booksWithFavorite = result.map(({ favorite, ...book }) => ({
    ...book,
    isFavorite: favorite.length > 0,
  }));

  return {
    meta: { total, page, limit },
    data: booksWithFavorite,
  };
};

const getBestSellingBook = async (
  params: IBookFilterRequest,
  options: IPaginationOptions,
  userId: string
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.BookWhereInput[] = [{ isDeleted: false }];

  if (searchTerm) {
    andConditions.push({
      OR: bookSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (filterData?.type) {
    const normalizedType =
      filterData.type.toUpperCase() as keyof typeof BookType;
    filterData.type = BookType[normalizedType];
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.BookWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.book.findMany({
    where: whereConditions,
    orderBy: [
      { perseCount: "desc" },
      ...(options.sortBy && options.sortOrder
        ? [{ [options.sortBy]: options.sortOrder }]
        : []),
    ],
    include: {
      favorite: {
        where: {
          favoritedById: userId,
        },
        select: {
          id: true,
        },
      },
    },
    skip,
    take: limit,
  });

  const booksWithIsFavorite = result.map(({ favorite, ...book }) => ({
    ...book,
    isFavorite: favorite.length > 0,
  }));

  const total = await prisma.book.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: booksWithIsFavorite,
  };
};

const deleteRecommended = async (bookId: string) => {
  console.log("bookId", bookId);
  const result = await prisma.book.update({
    where: {
      id: bookId,
    },
    data: {
      isRecommended: false,
    },
  });
  return result;
};
const getBooksOverview = async () => {
  const [eBook, audiobook] = await Promise.all([
    prisma.book.count({
      where: {
        type: BookType.EBOOK,
        isDeleted: false,
      },
    }),
    prisma.book.count({
      where: {
        type: BookType.AUDIOBOOK,
        isDeleted: false,
      },
    }),
  ]);

  // const deleteNull=await prisma.purchase.deleteMany({where:{book:null}})
  const totalRevineu = await prisma.purchase.findMany({
    
    include: {
      book: {
        select: {
          price: true,
        },
      },
    },
  });
const total = totalRevineu.reduce((acc, item) => {
  return acc + (item.book ? item.book.price : 0);
}, 0);

  return {
    eBook,
    audiobook,
    total,
  };
};
export const bookService = {
  createIntoDb,
  getListFromDb,
  getListName,
  getByIdFromDb,
  updateIntoDb,
  deleteItemFromDb,
  addRecommended,
  getBestSellingBook,
  getRecommended,
  deleteRecommended,
  getBooksOverview,
};
