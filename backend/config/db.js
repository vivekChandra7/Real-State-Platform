import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://vivekchandra2462_db_user:rQQDDMyFwTQej30W@project-2.9p1kzje.mongodb.net/RealEstate",
    )
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
};
