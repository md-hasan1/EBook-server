import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { RedeemController } from './Redeem.controller';
import { RedeemValidation } from './Redeem.validation';

const router = express.Router();

router.post(
'/',
auth(),
//validateRequest(RedeemValidation.createSchema),
RedeemController.createRedeem,
);
router.post(
'/use-point',
auth(),
//validateRequest(RedeemValidation.createSchema),
RedeemController.redeemBookByPoint,
);

router.get('/', auth(), RedeemController.getRedeemList);

router.get('/:id', auth(), RedeemController.getRedeemById);

router.put(
'/:id',
auth(),
//validateRequest(RedeemValidation.updateSchema),
RedeemController.updateRedeem,
);

router.delete('/:id', auth(), RedeemController.deleteRedeem);

export const RedeemRoutes = router;