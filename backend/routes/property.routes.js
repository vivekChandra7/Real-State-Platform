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
import { protect, authorize} from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const propertyRouter = express.Router();

propertyRouter.get("/", getAllProperties);
// protect the routes that only seller can do these works
propertyRouter.post("/", protect, authorize("seller"), upload.array("images", 10), addProperty);
propertyRouter.get("/my", protect, authorize("seller"), getMyProperties);
propertyRouter.put("/:id", protect, authorize("seller"), upload.array("images", 10), updateProperty);

propertyRouter.delete("/:id", protect, authorize("seller"), deleteProperty);
propertyRouter.patch("/:id/status", protect, authorize("seller"), updatePropertyStatus);

propertyRouter.get("/counts", getPropertyCounts);
propertyRouter.get("/:id", getPropertyDetails);

propertyRouter.get("/seller/dashboard", protect, authorize("seller"), getSellerDashboard);

export default propertyRouter;
 