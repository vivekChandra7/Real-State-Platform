import express from "express";
import { 
  getAllProperties, 
  addProperty, 
  getMyProperties, 
  updateProperty, 
  deleteProperty, 
  updatePropertyStatus, 
  getPropertyCounts, 
  getPropertyDetails, 
  getSellerDashboard 
} from "../controllers/property.controller.js"; 
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const propertyRouter = express.Router();

propertyRouter.get("/", getAllProperties);
// protect the routes that only seller can do these works
propertyRouter.post("/add", protect, authorizeRoles("seller"), upload.array("images", 10), addProperty);
propertyRouter.get("/my", protect, authorizeRoles("seller"), getMyProperties);
propertyRouter.put("/:id",protect, authorizeRoles("seller"), updateProperty);
propertyRouter.delete("/:id", protect, authorizeRoles("seller"), deleteProperty);
propertyRouter.patch("/:id/status", protect, authorizeRoles("seller"), updatePropertyStatus);
propertyRouter.get("/counts", getPropertyCounts);
propertyRouter.get("/:id",getPropertyDetails);
propertyRouter.get("/seller/dashboard", protect, authorizeRoles("seller"), getSellerDashboard);

export default propertyRouter;
