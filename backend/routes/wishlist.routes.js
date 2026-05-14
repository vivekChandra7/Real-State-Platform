import express from 'express';
import { addToWishlist, removeFromWishlist,getWishList } from '../controllers/wishlist.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const wishlistRouter = express.Router();

wishlistRouter.post('/:propertyId', protect, addToWishlist);
wishlistRouter.get('/', protect, getWishList);
wishlistRouter.delete('/:propertyId', protect, removeFromWishlist);

export default wishlistRouter;