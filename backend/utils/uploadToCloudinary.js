import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadToCloudinary = (buffer, folder="general") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
      },
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};
