import express from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import { bookValidationSchema } from '../validations/book.validation.js';
import * as bookController from '../controllers/book.controller.js'


const router = express.Router();

router.get('/', bookController.getAllBooks);
router.get('/:code', bookController.getBookByCode);

router.post('/', validate(bookValidationSchema), bookController.addBook);
router.post('/:code/borrow',bookController.borrowBook);
router.post('/:code/back', bookController.returnBook);

router.put('/:code',validate(bookValidationSchema), bookController.updateBook);

router.delete('/:code', bookController.deleteBook);

export default router