import express from 'express';
import * as bookController from '../controllers/book.controller.js'


const router = express.Router();

router.get('/', bookController.getAllBooks);
router.get('/:code', bookController.getBookByCode);
router.post('/', bookController.addBook);
router.put('/:code', bookController.updateBook);
router.post('/:code/borrow', bookController.borrowBook);
router.post('/:code/back', bookController.returnBook);
router.delete('/:code', bookController.deleteBook);

export default router