import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { sendInquiry,getInquiriesForSeller,markAsRead } from '../controllers/inquiry.controller.js';

const inquiryRouter = express.Router();

inquiryRouter.post('/', protect, authorize('buyer'), sendInquiry); 
inquiryRouter.get('/seller', protect, authorize('seller'), getInquiriesForSeller);
inquiryRouter.patch('/:id/read', protect, authorize('seller'), markAsRead);

export default inquiryRouter;