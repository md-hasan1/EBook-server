import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { bookService } from "./Book.service";
import sendResponse from "../../../shared/sendResponse";
import { bookFilterableFields } from "./Book.constant";
import pick from "../../../shared/pick";

const createBook = catchAsync(async (req, res) => {
  const result = await bookService.createIntoDb(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Book created successfully",
    data: result,
  });
});

// get all books from db
const getBookList = catchAsync(async (req, res) => {
  const filters = pick(req.query, bookFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await bookService.getListFromDb(filters, options, req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book list retrieved successfully!",
    data: result,
  });
});
const getListName = catchAsync(async (req, res) => {
  const filters = pick(req.query, bookFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await bookService.getListName(filters, options);
  1;
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book list retrieved successfully!",
    data: result,
  });
});

const getBookById = catchAsync(async (req, res) => {
  const result = await bookService.getByIdFromDb(req.params.id, req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book details retrieved successfully",
    data: result,
  });
});

const updateBook = catchAsync(async (req, res) => {
  const result = await bookService.updateIntoDb(req.params.id, req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book updated successfully",
    data: result,
  });
});

const deleteBook = catchAsync(async (req, res) => {
  const result = await bookService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book deleted successfully",
    data: result,
  });
});
const addRecommended = catchAsync(async (req, res) => {
  const result = await bookService.addRecommended(req.body.bookId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book deleted successfully",
    data: result,
  });
});
const getRecommended = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await bookService.getRecommended(userId, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recommended book list retrieved successfully!",
    data: result,
  });
});

const getBestSellingBook = catchAsync(async (req, res) => {
  const userId=req.user.id
  const filters = pick(req.query, bookFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await bookService.getBestSellingBook(filters, options,userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book retrieved successfully",
    data: result,
  });
});
const deleteRecommended = catchAsync(async (req, res) => {
  const bookId=req.params.id
  const result = await bookService.deleteRecommended(bookId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book delete form recommended successfully",
    data: result,
  });
});
const getBooksOverview = catchAsync(async (req, res) => {
  const bookId=req.params.id
  const result = await bookService.getBooksOverview();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book retraived successfully",
    data: result,
  });
});


export const BookController = {
  createBook,
  getBookList,
  getBookById,
  getListName,
  updateBook,
  deleteBook,
  addRecommended,
  getRecommended,
  getBestSellingBook,
  deleteRecommended,
  getBooksOverview
};
