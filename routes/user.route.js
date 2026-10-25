import express, { Router } from 'express'
import * as userController from '../controllers/user.controller.js'
import { validate } from '../middlewares/validate.middleware.js';
import { userValidationSchema } from '../validations/user.validation.js';


const router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/sign-in', userController.signIn)
router.post('/sigh-up',validate(userValidationSchema), userController.signUp)

export default router;