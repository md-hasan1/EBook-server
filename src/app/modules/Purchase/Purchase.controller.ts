import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { purchaseService } from './Purchase.service';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';


const createPurchase = catchAsync(async (req, res) => {
  const result = await purchaseService.createIntoDb(req.body,req.user);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Purchase created successfully',
    data: result,
  });
});

const getPurchaseList = catchAsync(async (req, res) => {
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await purchaseService.getListFromDb(req.user, req.query, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Purchase list retrieved successfully',
    data: result,
  });
});


const getPurchaseById = catchAsync(async (req, res) => {
  const result = await purchaseService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Purchase details retrieved successfully',
    data: result,
  });
});

const updatePurchase = catchAsync(async (req, res) => {
  const result = await purchaseService.updateIntoDb(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Purchase updated successfully',
    data: result,
  });
});

const deletePurchase = catchAsync(async (req, res) => {
  const result = await purchaseService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Purchase deleted successfully',
    data: result,
  });
});
const pinPurchaseBook = catchAsync(async (req, res) => {
  const result = await purchaseService.pinPurchaseBook(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Purchase book pin successfully',
    data: result,
  });
});


export const purchaseController = {
  createPurchase,
  getPurchaseList,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
  pinPurchaseBook

};