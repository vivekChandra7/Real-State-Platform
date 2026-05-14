import User from "../models/user.model.js";
import Property from "../models/property.model.js";
import Inquiry from "../models/inquiry.model.js";

// Admin Dashboard Data

// View all users (admin only)

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch users data by admin",
    });
  }
};

// block a particular user (admin only)

export const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.isBlocked = !user.isBlocked; // Toggle the block status
    await user.save();
    res.status(200).json({
      success: true,
      message: user.isBlocked
        ? "User has been blocked"
        : "User has been unblocked",
      isBlocked: user.isBlocked,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to update user block status",
    });
  }
};

// to delete a particular user (admin only)

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete user",
    });
  }
};

// view all properties (admin only)

export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("seller", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch properties data by admin",
    });
  }
};

// to delete a particular property (admin only)

export const deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findByIdAndDelete(propertyId);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete property",
    });
  }
};

// view all inquiries (admin only)

export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .populate("property", "title price")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch inquiries data by admin",
    });
  }
};

// get dashboard statistics (admin only)

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const activeListings = await Property.countDocuments({ isActive: true });
    const soldProperties = await Property.countDocuments({ isActive: false });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProperties,
        activeListings,
        soldProperties,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard statistics",
    });
  }
};


// to get the pending seller account requests (admin only)

export const getPendingSellerRequests = async (req, res) => {
  try {
    const pendingSellers = await User.find({
      role: "seller",
      isApproved: false,
    })
      .select("-password")
      .sort({ createdAt: -1 });
    // if you are a seller you will get approval from admin
    res.status(200).json({
      success: true,
      count: pendingSellers.length,
      data: pendingSellers,
    });
  } 
  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch pending seller requests",
    });
  }
};
