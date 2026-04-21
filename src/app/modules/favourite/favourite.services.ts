import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiErrors';
import prisma from '../../../shared/prisma';
import { IPaginationOptions } from '../../../interfaces/paginations';
import { paginationHelper } from '../../../helpars/paginationHelper';

const toggleFavorite = async (
bookId: string ,
  user: any,
) => {

  // Check if the user to be favorited exists
  const isBookExits = await prisma.book.findUnique({
    where: {
      id:bookId,
    },
  });

  if (!isBookExits) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if the favorite already exists for the user
  const existingFavorite = await prisma.favorite.findFirst({
    where: {
      favoritedById: user.id,
      bookId: bookId,
    },
  });

  if (existingFavorite) {
    // If it exists, remove the favorite
    const result = await prisma.favorite.delete({
      where: {
        id: existingFavorite.id,
      },
    });
    return { result, message: 'Favorite removed successfully.' };
  } else {
    // If it doesn't exist, add the favorite
    const result = await prisma.favorite.create({
      data: {
        favoritedById: user.id,
        bookId: bookId,
      },
    });

    
    return { result, message: 'Favorite added successfully.' };
    
  }
};

const getAllFavorites = async (options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const result = await prisma.favorite.findMany({
    skip,
    take: limit,
    include: {
      favoritedBy: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
          profileImage: true,
        },
      },
      book: {
        select: {
          id: true,
          bookName: true,
          coverImage: true,
          price: true,
          file: true,
          description: true,
          type: true,
          totalPages: true,
          length: true,
          formate: true,
          publisher: true,
          releaseDate: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  const total = await prisma.favorite.count(); // Total number of favorites

  // Add `isFavorite` field
  const favoriteUserIds = new Set(result.map((fav) => fav.book.id));

  const finalResult = result.map((fav) => ({
    id: fav.id,
    favoritedBy: fav.favoritedBy,
    user: {
      ...fav.book,
      isFavorite: favoriteUserIds.has(fav.book.id),
    },
  }));

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: finalResult,
  };
};


const getFavoriteById = (id: string) => {
  return prisma.favorite.findUniqueOrThrow({
    where: { id },
    include: {
      favoritedBy: true,
      book: {
        select:{
          id:true,
          category:true,
          bookName:true,
          coverImage:true,
          price:true,
          file:true,
          description:true,
          type:true,
          totalPages:true,
          length:true,
          formate:true, 
          publisher:true,
          releaseDate:true,
          createdAt:true,
          updatedAt:true,
        }
      },
    },
  });
};


const deleteFavorite = async (id: string) => {
  const isFavoriteExist = await prisma.favorite.findUnique({
    where: { id },
  });

  if (!isFavoriteExist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Favorite not found with the id ' + id,
    );
  }

  return await prisma.favorite.delete({
    where: { id },
  });
};

const getFavoritesByUser = async (userId: string) => {
  // Fetch favorite users
  const favoriteUsers = await prisma.favorite.findMany({
    where: { favoritedById: userId },
    include: {
      book:{
        select:{
          id:true,
          category:true,
          bookName:true,
          coverImage:true,
          price:true,
          file:true,
          description:true,
          type:true,
          totalPages:true,
          length:true,
          formate:true, 
          publisher:true,
          releaseDate:true,
          createdAt:true,
          updatedAt:true,
        }
      },
      
    
    },
  });

  // Convert favoriteUsers to an array of user IDs
  const favoriteUserIds = new Set(favoriteUsers.map((fav) => fav.book.id));

  // Add `isFavorite` field to each favorited user
  const result = favoriteUsers.map((fav) => ({
    id: fav.id,
    book: {
      ...fav.book,
      isFavorite: favoriteUserIds.has(fav.book.id), // Always true since these are favorited users
    },
  }));

  return result;
};

export const FavoriteService = {
  toggleFavorite,
  getAllFavorites,
  getFavoriteById,
  deleteFavorite,
  getFavoritesByUser,
};
