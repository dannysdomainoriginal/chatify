import * as messagesController from "@/controllers/messages.controller";
import { arcjectProtection } from "@/middlewares/arcjet.middleware";
import { protectRoute } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.use(arcjectProtection);
router.use(protectRoute);

router.get("/contacts", messagesController.getAllContacts);
router.get("/chats", messagesController.getChatPartners);
router.get("/:id", messagesController.getMessagesByUserId);
router.post("/send:id", messagesController.sendMessage);

export default router;
