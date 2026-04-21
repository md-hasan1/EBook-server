import httpStatus from 'http-status';

import { redeemService } from './Redeem.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const createRedeem = catchAsync(async (req, res) => {
  const result = await redeemService.createIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Redeem created successfully',
    data: result,
  });
});

const getRedeemList = catchAsync(async (req, res) => {
  const userId= req.user.id;
  const result = await redeemService.getListFromDb(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Redeem list retrieved successfully',
    data: result,
  });
});

const getRedeemById = catchAsync(async (req, res) => {
  const result = await redeemService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Redeem details retrieved successfully',
    data: result,
  });
});

const updateRedeem = catchAsync(async (req, res) => {
  const result = await redeemService.updateIntoDb(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Redeem updated successfully',
    data: result,
  });
});

const deleteRedeem = catchAsync(async (req, res) => {
  const result = await redeemService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Redeem deleted successfully',
    data: result,
  });
});
const redeemBookByPoint = catchAsync(async (req, res) => {
  const result = await redeemService.redeemBookByPoint(req.user.id,req.body.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Redeem book use point successfully',
    data: result,
  });
});

export const RedeemController = {
  createRedeem,
  getRedeemList,
  getRedeemById,
  updateRedeem,
  redeemBookByPoint,
  deleteRedeem,
};