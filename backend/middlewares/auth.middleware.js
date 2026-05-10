import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// ✅ Middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    // Step 1: Header se token nikalo
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Step 2: Token missing check
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    // Step 3: Token verify karo  ✅ if block ke BAHAR
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 4: DB se user dhundo  ✅ if block ke BAHAR
    req.user = await User.findById(decoded.id).select("-password");

    // Step 5: User exist karta hai?
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Step 6: Blocked check       ✅ if block ke BAHAR
    if (req.user.isBlocked) {
      return res.status(401).json({
        success: false,
        message:
          "Your account has been blocked by admin. Please contact support.",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};

//  Role Based Authentication — Sirf Admin
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied, admin only",
    });
  }
};

//  Role Based Authentication — Multiple Roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied, role '${req.user.role}' is not allowed`,
      });
    }
    next();
  };
};
