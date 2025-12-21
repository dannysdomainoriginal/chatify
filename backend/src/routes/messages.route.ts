import * as messagesController from "@/controllers/messages.controller";
import { arcjectProtection } from "@/middlewares/arcjet.middleware";
import { protectRoute } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

// router.use(arcjectProtection);
router.use(protectRoute);

router.get("/contacts", messagesController.getAllContacts);
router.get("/chats", messagesController.getChatPartners);
router.get("/:id", messagesController.getMessagesByUserId);
router.post("/send/:id", messagesController.sendMessage);

const catchCastErrors: (...args: any[]) => any = (err, req, res, next) => {
  if (err.name === "CastError") {
    return res.status(400).json({
      status: 400,
      message: "The ID parameter provided is invalid",
    });
  }
};

router.use(catchCastErrors)

export default router;