import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { bannerService } from './Banner.service';
import sendResponse from '../../../shared/sendResponse';


const createBanner = catchAsync(async (req, res) => {
  const result = await bannerService.createIntoDb(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Banner created successfully',
    data: result,
  });
});

const getBannerList = catchAsync(async (req, res) => {
  const result = await bannerService.getListFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner list retrieved successfully',
    data: result,
  });
});

const getBannerById = catchAsync(async (req, res) => {
  const result = await bannerService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner details retrieved successfully',
    data: result,
  });
});

const updateBanner = catchAsync(async (req, res) => {
  const result = await bannerService.updateIntoDb(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner updated successfully',
    data: result,
  });
});

const deleteBanner = catchAsync(async (req, res) => {
  const result = await bannerService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner deleted successfully',
    data: result,
  });
});

export const BannerController = {
  createBanner,
  getBannerList,
  getBannerById,
  updateBanner,
  deleteBanner,
};