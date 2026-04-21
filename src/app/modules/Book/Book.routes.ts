import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BookController } from './Book.controller';
import { BookValidation } from './Book.validation';
import { fileUploader } from '../../../helpars/fileUploader';

const router = express.Router();

router.post(
'/',
auth(),
//validateRequest(BookValidation.createSchema),
fileUploader.addBook,
BookController.createBook,
);
router.post(
'/add-recommended',
auth(),
//validateRequest(BookValidation.createSchema),
//fileUploader.addBook,
BookController.addRecommended,
);

router.get('/', auth(), BookController.getBookList);
router.get('/for-name', auth(), BookController.getListName);
router.get('/recommended', auth(), BookController.getRecommended);
router.get('/best-selling', auth(), BookController.getBestSellingBook);
router.get('/getBooksOverview', auth(), BookController.getBooksOverview);

router.get('/:id', auth(), BookController.getBookById);

router.put(
'/:id',
auth(),
// validateRequest(BookValidation.updateSchema),
fileUploader.addBook,
BookController.updateBook,
);

router.delete('/recommended/:id', auth(), BookController.deleteRecommended);
router.delete('/:id', auth(), BookController.deleteBook);

export const BookRoutes = router;