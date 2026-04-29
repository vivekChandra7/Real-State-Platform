import upload from '../middlewares/upload.middleware.js';
import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { getProfile, updateProfile, getPublicProfile } from '../controllers/user.controller.js';


const userRouter = express.Router();

userRouter.get('/profile/:id', getPublicProfile);
userRouter.get('/profile', protect, getProfile);
userRouter.put('/profile', protect, upload.single('profilePic'), updateProfile);
 
export default userRouter;