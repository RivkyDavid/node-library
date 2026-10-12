import userRouter from "./user.route.js";
import express from 'express';

const router=express.Router();

router.use('/users',userRouter);
// router.use('/books',bookRouter)


export default router;