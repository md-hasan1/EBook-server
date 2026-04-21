import { Request, Response } from "express";
import httpStatus from "http-status";

import { FavoriteService } from "./favourite.services";
import catchAsync from "../../../shared/catchAsync";
import ApiError from "../../../errors/ApiErrors";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";


// Controller to add or remove a post from the user's favorites
const toggleFavourite = catchAsync(async (req: Request, res: Response) => {
  const { bookId } = req.body; // assuming postId is in the request body
  const user = req.user; // Assuming the user is attached to the request (from auth middleware)

  if (!bookId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Post ID is required.");
  }

  const { result, message } = await FavoriteService.toggleFavorite(
    bookId,
    user
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: message,
    data: result,
  });
});

// Controller to get all favorites (admin use case)
const getAllFavourites = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await FavoriteService.getAllFavorites(options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Favorites retrieved successfully.",
    data: result,
  });
});


// Controller to get a specific favorite by ID
const getFavouriteById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FavoriteService.getFavoriteById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Favorite retrieved successfully.",
    data: result,
  });
});


// Controller to delete a favorite by ID
const deleteFavourite = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as any;
  const result = await FavoriteService.deleteFavorite(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Remove from Favorite list  successfully.",
    data: result,
  });
});

// Controller to get all favorites by user
const getFavouritesByUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any

  const result = await FavoriteService.getFavoritesByUser(user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User's favorites retrieved successfully.",
    data: result,
  });
});

export const FavouriteController = {
  toggleFavourite,
  getAllFavourites,
  getFavouriteById,
  deleteFavourite,
  getFavouritesByUser,
};
