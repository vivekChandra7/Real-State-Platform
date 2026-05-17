import express from "express";
import Chat from "../models/chat.model.js";
import { protect } from "../middlewares/auth.middleware.js";

const chatRouter = express.Router();
chatRouter.use(protect);

// to create a chat

chatRouter.post("/start", async (req, res) => {
  try {
    const { propertyId, sellerId, buyerId: providedBuyerId } = req.body;
    let buyerId, finalSellerId;
    if (req.user.role === "seller") {
      buyerId = providedBuyerId;
      finalSellerId = req.user._id;
    } else {
      buyerId = req.user._id;
      finalSellerId = sellerId;
    }
    if (!buyerId || !finalSellerId) {
      return res.status(400).json({ message: "missing buyer or seller " });
    }
    // check if chat already exists for the property between the buyer and seller\
    let chat = await Chat.findOne({
      Property: propertyId,
      buyer: buyerId,
      seller: finalSellerId,
    });
    if (!chat) {
      chat = await Chat.create({
        Property: propertyId,
        buyer: buyerId,
        seller: finalSellerId,
        messages: [],
      });
    }
    chat = await chat
      .populate("buyer", "name email profilePicture")
      .populate("seller", "name email profilePicture")
      .populate("Property", "title price images");
    res.json(chat);
  } catch (error) {
    return res.status(500).json({ message: "Error creating chat" });
  }
});

// to send a message in a chat

chatRouter.post("/send", async (req, res) => {
  try {
    const { chatId, text, image } = req.body;
    const userId = req.user._id;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // ensure sender is part of the chat
    if (chat.buyer.toString() !== userId && chat.seller.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to send message in this chat" });
    }
    const newMessage = {
      sender: userId,
      text,
      image,
      createdAt: new Date(),
    };
    chat.messages.push(newMessage);
    await chat.save();
    const savedMessage = chat.messages[chat.messages.length - 1];
    res.json({ chat, newMessage: savedMessage });
  } catch (error) {
    return res.status(500).json({ message: "Error sending message" });
  }
});
export default chatRouter;

// to get all chats for a user
chatRouter.get("/user", async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({
      $or: [{ buyer: userId }, { seller: userId }],
    })
      .populate("buyer", "name email profilePicture")
      .populate("seller", "name email profilePicture")
      .populate("Property", "title price images")
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching chats", error: error.message });
  }
});

// to get the chat messages 

chatRouter.get("/:chatId", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate("messages.sender", "name profilePicture");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const userId = req.user._id;

    if (
      chat.buyer.toString() !== userId.toString() &&
      chat.seller.toString() !== userId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view messages in this chat" });
    }

    res.json(chat.messages);

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching chat messages",
      error: error.message,
    });
  }
});

// to delete an entire chat (buyer or seller can delete)

chatRouter.delete("/:chatId", async (req, res) => {
    try{
        const userId = req.user._id;
        const chat = await Chat.findById(req.params.chatId);
        if(!chat){
            return res.status(404).json({message:"Chat not found"});
        }

        // now we ensure the user is part of the chat
        if(chat.buyer.toString() !== userId && chat.seller.toString() !== userId){
            return res.status(403).json({message:"Not authorized to delete this chat"});
        }
        await Chat.findByIdAndDelete(req.params.chatId);
        res.json({message:"Chat deleted successfully"});
    


    }
    catch(error){
        return res.status(500).json({message:"Error deleting chat", error:error.message});
    }
  });

  // to delete a particular message in the chat (buyer or seller can delete)

chatRouter.delete("/:chatId/message/:messageId", async (req, res) => {
    try{
        const userId = req.user._id;
        const chat = await Chat.findById(req.params.chatId);
        if(!chat){
            return res.status(404).json({message:"Chat not found"});
        }   
        const message = chat.messages.id(req.params.messageId);
        if(!message){
            return res.status(404).json({message:"Message not found"});
        }
        if(message.sender.toString() !== userId){
            return res.status(403).json({message:"Not authorized to delete this message"});
        }

        chat.messages.pull({ _id: req.params.messageId });
        await chat.save();
        res.json({message:"Message deleted successfully"});
    }
    catch(error){
        return res.status(500).json({message:"Error deleting message", error:error.message});
    }
  }
);