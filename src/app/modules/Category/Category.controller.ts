import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { categoryService } from './Category.service';
import sendResponse from '../../../shared/sendResponse';


const createCategory = catchAsync(async (req, res) => {
  const result = await categoryService.createIntoDb(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'category created successfully',
    data: result,
  });
});

const getCategoryList = catchAsync(async (req, res) => {
  const result = await categoryService.getListFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'category list retrieved successfully',
    data: result,
  });
});

const getCategoryById = catchAsync(async (req, res) => {
  const result = await categoryService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'category details retrieved successfully',
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const result = await categoryService.updateIntoDb(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'category updated successfully',
    data: result,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const result = await categoryService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'category deleted successfully',
    data: result,
  });
});

export const categoryController = {
  createCategory,
  getCategoryList,
  getCategoryById,
  updateCategory,
  deleteCategory,
};