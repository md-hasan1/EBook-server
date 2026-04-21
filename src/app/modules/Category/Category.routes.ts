import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { categoryController } from './Category.controller';
import { fileUploader } from '../../../helpars/fileUploader';


const router = express.Router();

router.post(
'/',
auth(),
//validateRequest(categoryValidation.createSchema),
fileUploader.uploadSingle,
categoryController.createCategory,
);

router.get('/', auth(), categoryController.getCategoryList);

router.get('/:id', auth(), categoryController.getCategoryById);

router.put(
'/:id',
auth(),
//validateRequest(categoryValidation.updateSchema),
fileUploader.uploadSingle,
categoryController.updateCategory,
);

router.delete('/:id', auth(), categoryController.deleteCategory);

export const categoryRoutes = router;