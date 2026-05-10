import "dotenv/config";
import express from "express";
import cors from "cors";

import http from "http";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";
import inquiryRouter from "./routes/inquiry.routes.js";


const app = express();
const PORT = process.env.PORT || 5000;

//Db
connectDB();
//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/property", propertyRouter);
app.use("/api/inquiry", inquiryRouter);

app.get("/", (req, res) => { 
  res.send("Api Working vivek jii");
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
