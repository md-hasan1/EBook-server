import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { pointService } from './Point.service';
import sendResponse from '../../../shared/sendResponse';

const createPoint = catchAsync(async (req, res) => {
  const result = await pointService.createIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Point created successfully',
    data: result,
  });
});

const getPointList = catchAsync(async (req, res) => {
  const result = await pointService.getListFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Point list retrieved successfully',
    data: result,
  });
});

const getPointById = catchAsync(async (req, res) => {
  const result = await pointService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Point details retrieved successfully',
    data: result,
  });
});

const updatePoint = catchAsync(async (req, res) => {
  const result = await pointService.updateIntoDb(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Point updated successfully',
    data: result,
  });
});

const deletePoint = catchAsync(async (req, res) => {
  const result = await pointService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Point deleted successfully',
    data: result,
  });
});

export const pointController = {
  createPoint,
  getPointList,
  getPointById,
  updatePoint,
  deletePoint,
};