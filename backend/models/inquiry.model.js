import mongoose from "mongoose";
import Property from "./property.model.js";
import User from "./user.model.js";

const inquirySchema = new mongoose.Schema(
  {
    Property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);
export default Inquiry;
