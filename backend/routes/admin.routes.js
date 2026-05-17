import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { getDashboardStats ,getAllUsers,blockUser,deleteUser,getAllProperties,getAllInquiries,getPendingSellerRequests,deleteProperty,approveSeller } from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.use(protect, authorize("admin"));


adminRouter.get("/users", getAllUsers);
adminRouter.patch("/users/:id/block", blockUser);
adminRouter.delete("/users/:id", deleteUser);
adminRouter.get("/stats", getDashboardStats);
adminRouter.get("/properties", getAllProperties);
adminRouter.get("/inquiries", getAllInquiries);
adminRouter.get("/pending-sellers", getPendingSellerRequests);  
adminRouter.delete("/properties/:id", deleteProperty);
adminRouter.patch("/approve-seller/:id", approveSeller);                                                            


export default adminRouter; 
