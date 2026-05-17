import "dotenv/config";
import express from "express";
import cors from "cors";

import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";
import inquiryRouter from "./routes/inquiry.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import contactRouter from "./routes/contact.routes.js";
import adminRouter from "./routes/admin.routes.js";
import chatRouter from "./routes/chat.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

//Db
connectDB();
//Middleware
const allowedOrigins = ["http://localhost:5173"].filter(Boolean);
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

//Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/property", propertyRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/contact", contactRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chat", chatRouter);

app.get("/", (req, res) => {
  res.send("Api Working vivek jii");
});

const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  socket.on("joinChat", () => {
    socket.join("chatId");
  });
  socket.on("sendMessage", (data) => {
    io.to("chatId").emit("receiveMessage", data);
  });
  socket.on("disconnect", () => {});
});

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
