import express from "express";
import { createContact,getAllContacts } from "../controllers/contact.controller.js";
import {protect} from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/auth.middleware.js";

const contactRouter = express.Router();

contactRouter.post("/", createContact);
contactRouter.get("/", protect, authorize("admin"), getAllContacts);

export default contactRouter;
