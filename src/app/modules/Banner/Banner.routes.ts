import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BannerController } from './Banner.controller';
import { BannerValidation } from './Banner.validation';
import { fileUploader } from '../../../helpars/fileUploader';

const router = express.Router();

router.post(
'/',
auth(),
// validateRequest(BannerValidation.createSchema),
fileUploader.uploadSingle,
BannerController.createBanner,
);

router.get('/', auth(), BannerController.getBannerList);

router.get('/:id', auth(), BannerController.getBannerById);

router.put(
'/:id',
auth(),
// validateRequest(BannerValidation.updateSchema),
fileUploader.uploadSingle,
BannerController.updateBanner,
);

router.delete('/:id', auth(), BannerController.deleteBanner);

export const BannerRoutes = router;