import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { pointController } from './Point.controller';
import { PointValidation } from './Point.validation';

const router = express.Router();

router.post(
'/',
auth(),
// validateRequest(PointValidation.createSchema),
pointController.createPoint,
);

router.get('/', auth(), pointController.getPointList);

router.get('/:id', auth(), pointController.getPointById);

router.put(
'/:id',
auth(),
// validateRequest(PointValidation.updateSchema),
pointController.updatePoint,
);

router.delete('/:id', auth(), pointController.deletePoint);

export const PointRoutes = router;