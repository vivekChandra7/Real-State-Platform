import Inquiry from "../models/inquiry.model.js";
import Property from "../models/property.model.js";

//buyer sends inquiry to seller
export const sendInquiry = async (req, res) => {
  try {
    const { propertyId, message } = req.body;
    const property = await Property.findById(propertyId).populate("seller");
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }
    const inquiry = await Inquiry.create({
      Property: propertyId,
      buyer: req.user._id,
      seller: property.seller._id,
      message,
    });
    res.status(201).json({
      message: "Inquiry sent successfully",
      inquiry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//seller views inquiries

export const getInquiriesForSeller = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({
      seller: req.user._id,
    })
      .populate("buyer", "name email phone")
      .populate("Property", "title price images city")
      .sort({ createdAt: -1 }); // Sort by most recent inquiries first
    res.status(200).json({ success: true, count: inquiries.length, inquiries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// mark inquiry as read by seller

export const markAsRead = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Inquiry not found" });
    }
    inquiry.isRead = true;
    await inquiry.save();
    res.status(200).json({ success: true, message: "Inquiry marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

