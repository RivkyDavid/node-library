import express, { Router } from 'express'
import * as userController from '../controllers/user.controller.js'

const router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/sign-in', userController.signIn)
router.post('/sigh-up', userController.signUp)

export default router;