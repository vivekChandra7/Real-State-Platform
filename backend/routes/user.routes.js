import express from 'express';
import protect from '../middleware/auth.middleware.js';
import { getProfile, updateProfile, getPublicProfile } from '../controllers/user.controller.js';


const userRouter = express.Router();

userRouter.get('/profile', protect, getProfile);
userRouter.put('/profile', protect, upload.single('profilePic'), updateProfile);
userRouter.get('/profile/:id', getPublicProfile);
 
export default userRouter;