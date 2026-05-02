import Property from "../models/property.model.js";
import Inquiry from "../models/inquiry.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import cloudinary from "../config/cloudinary.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// add a property
export const addProperty = async (req, res) => {
  try {
    let imgUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, "properties");
        imgUrls.push(result.secure_url);
      }
    }
    const property = await Property.create({
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      city: req.body.city,
      area: req.body.area,
      pincode: req.body.pincode,
      propertyType: req.body.propertyType,
      bhk: req.body.bhk ? String(req.body.bhk) : undefined,
      bathrooms: req.body.bathrooms ? Number(req.body.bathrooms) : undefined,
      areaSize: req.body.areaSize ? Number(req.body.areaSize) : undefined,
      furnishing: req.body.furnishing,
      status: req.body.status,
      images: imgUrls,
      seller: req.user._id,
      amenities: req.body.amenities
        ? Array.isArray(req.body.amenities)
          ? req.body.amenities
          : (() => {
              try {
                return JSON.parse(req.body.amenities);
              } catch (e) {
                return req.body.amenities.split(",");
              }
            })()
        : [],
    });
    res.json({
      success: true,
      property,
    });
  } catch (error) {
    console.error("ADD_PROPERTY_ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error while adding property",
    });
  }
};

// to get my properties

export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ seller: req.user._id });
    res.json({
      success: true,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Internal server error while fetching properties",
    });
  }
};

// Update a property

export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (property.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    } // check if the user is the owner of the property

    const fields = [
      "title",
      "description",
      "price",
      "city",
      "area",
      "pincode",
      "propertyType",
      "bhk",
      "bathrooms",
      "areaSize",
      "furnishing",
      "status",
      "amenities",
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "amenities" && typeof req.body[field] === "string") {
          try {
            property[field] = JSON.parse(req.body[field]);
          } catch (e) {
            property[field] = req.body[field].split(",");
          }
        } else {
          property[field] = req.body[field];
        }
      }
    });

    //   handle images - keep existing and add new ones

    if (req.body.existingImages) {
      try {
        const existing = JSON.parse(req.body.existingImages);
        property.images = Array.isArray(existing) ? existing : property.images;
      } catch (e) {
        console.error("Failed to parse existingImages:", e);
      }
    } // delete existing images

    // upload new images if provided and append to existing ones

    if (req.files && req.files.length > 0) {
      let newImages = [];
      for (let file of req.files) {
        const result = await uploadToCloudinary(file.buffer, "properties");
        newImages.push(result.secure_url);
      }
      property.images = [...property.images, ...newImages];
    }

    await property.save();

    res.json({
      success: true,
      message: "Property updated",
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete a property
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }
    if (property.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }
    //    delete image from cloudinary

    for (let imgUrl of property.images) {
      const publicId = imgUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`properties/${publicId}`);
    }
    await property.deleteOne();
    res.json({
      success: true,
      message: "Property deleted successfull",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update property status

export const updatePropertyStatus = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }
    if (property.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }
    property.status = req.body.status;
    await property.save();
    res.json({
      success: true,
      message: "Property status updated",
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL PROPERTIES

export const getAllProperties = async (req, res) => {
  try {
    const {
      city,
      area,
      pincode,
      propertyType,
      bhk,
      furnishing,
      status,
      minPrice,
      maxPrice,
      amenities,
      sort,
      seller,
    } = req.query;

    let query = {
      status: "sale",
    };

    if (seller) query.seller = seller;
    if (city) query.city = new RegExp(city, "i");
    if (area) query.area = new RegExp(area, "i");
    if (pincode) query.pincode = pincode;

    if (propertyType) {
      query.propertyType = { $in: propertyType.toLowerCase().split(",") };
    }
    if (bhk) {
      if (bhk === "5+") {
        query.bhk = { $gte: "5" };
      } else {
        query.bhk = bhk;
      }
    }
    if (furnishing) {
      const furnishingArray = furnishing.split(",");
      query.furnishing = {
        $in: furnishingArray.map((f) => new RegExp(`^${f.trim()}$`, "i")),
      };
    }
    if (status) query.status = status;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && !isNaN(minPrice)) query.price.$gte = Number(minPrice);
      if (maxPrice && !isNaN(maxPrice)) query.price.$lte = Number(maxPrice);
      if (Object.keys(query.price).length === 0) delete query.price;
    }

    if (amenities) {
      query.amenities = {
        $in: amenities.split(",").map((a) => a.trim()),
      };
    }

    let sortOption = { createdAt: -1 };
    if (sort === "priceLow") sortOption = { price: 1 };
    if (sort === "priceHigh") sortOption = { price: -1 };
    if (sort === "latest") sortOption = { createdAt: -1 };

    const properties = await Property.find(query)
      .populate("seller", "name phone profilePic")
      .sort(sortOption);

    res.json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching properties",
      error: error.message,
    });
  }
};

// get property details

export const getPropertyDetails = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "seller",
      "name phone profilePic",
    );
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // unique view tracking by id
    let visitorId = req.ip;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        visitorId = decoded.id;
      } catch (err) {
        // ignore
      }
    }
    const isSellerChecking = visitorId === property.seller._id.toString();
    if (!isSellerChecking && !property.viewedBy.includes(visitorId)) {
      property.views += 1;
      property.viewedBy.push(visitorId);
      await property.save();
    }
    const similarProperties = await Property.find({
      _id: { $ne: property._id },
      city: property.city,
      propertyType: property.propertyType,
      status: property.status,
    })
      .limit(4)
      .select("title price city area images propertyType status");
    res.json({
      success: true,
      property,
      similarProperties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// seller dashboard

export const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const totalProperties = await Property.countDocuments({ seller: sellerId });
    const activeListings = await Property.countDocuments({
      seller: sellerId,
      status: "sale",
    });
    const soldProperties = await Property.countDocuments({
      seller: sellerId,
      status: "sold",
    });
    const inquiries = await Inquiry.countDocuments({ seller: sellerId });

    const properties = await Property.aggregate([
      { $match: { seller: sellerId } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);
    const totalViews = properties.length > 0 ? properties[0].totalViews : 0;

    res.json({
      success: true,
      dashboardData: {
        totalProperties,
        activeListings,
        soldProperties,
        inquiries,
        totalViews,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching dashboard",
      error: error.message,
    });
  }
};

// get property counts by type
export const getPropertyCounts = async (req, res) => {
  try {
    const counts = await Property.aggregate([
      { $match: { status: "sale" } },
      { $group: { _id: "$propertyType", count: { $sum: 1 } } },
    ]);

    const formattedCounts = counts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});
    
    res.json({
      success: true,
      counts: formattedCounts,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching property counts",
      error: error.message,
    });
  }
};
