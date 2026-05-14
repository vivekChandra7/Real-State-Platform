import wishlist from "../models/wishlist.model.js";

// To add property to wishlist

export const addToWishlist = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const existing = await wishlist.findOne({
      user: req.user._id,
      property: propertyId,
    });
    if (existing) {
      return res
        .status(200)
        .json({ success: true, message: "Property already in wishlist" });
    }
    await wishlist.create({
      user: req.user._id,
      property: propertyId,
    });
    res
      .status(200)
      .json({ success: true, message: "Property added to wishlist" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error adding to wishlist" });
  }
};

// to get wishlist of user

export const getWishList = async (req, res) => {
  try {
    const data = await wishlist
      .find({ user: req.user._id })
      .populate("property");
    res.status(200).json({ success: true, data });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching wishlist" });
  }
};

// to remove property from wishlist

export const removeFromWishlist = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const result = await wishlist.findOneAndDelete({
      user: req.user._id,
      property: propertyId,
    });
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: " wishlist item not found " });
    }
    res
      .status(200)
      .json({ success: true, message: " removed from wishlist" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error removing from wishlist" });
  }
};
