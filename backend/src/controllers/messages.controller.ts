import cloudinary from "@/lib/cloudinary";
import Message from "@/models/Message";
import User from "@/models/User";
import { RequestHandler } from "express";
import createError from "http-errors";

export const getAllContacts: RequestHandler = async (req, res) => {
  const { _id: id } = req.user;

  const filteredUsers = await User.find({ _id: { $ne: id } })
    .select("-password")
    .lean({ versionKey: false });

  res.status(200).json(filteredUsers);
};

/* -------------------------------------------------------------------------- */

export const getMessagesByUserId: RequestHandler = async (req, res) => {
  const myId = req.user._id;
  const receipentId = req.params.id;

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: receipentId },
      { senderId: receipentId, receiverId: myId },
    ],
  })
    .sort({ updatedAt: 1 });

  res.status(200).json(messages);
};

/* -------------------------------------------------------------------------- */

type sendMessageBody = {
  text: string;
  image: string; // base64 data url
};

export const sendMessage: RequestHandler = async (req, res) => {
  const { text, image }: sendMessageBody = req.body;
  const receiverId = req.params.id;
  const senderId = req.user._id;

  // Securing sendMessage routes
  if (!text && !image)
    throw createError.BadRequest("Text or image is required to send a message");

  if (senderId.equals(receiverId))
    throw createError.Forbidden("Cannot send messages to yourself");

  const receiverExists = await User.exists({ _id: receiverId });
  if (!receiverExists)
    throw createError.NotFound("Receiver account does not exist");

  let imageUrl;
  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "chatify/messages"
    });

    imageUrl = uploadResponse.secure_url;
  }

  const newMessage = await Message.create({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });

  // TODO: send message in real-time if user is online - socket.io

  res.status(201).json(newMessage);
};

/* -------------------------------------------------------------------------- */

export const getChatPartners: RequestHandler = async (req, res) => {
  const loggedInUser = req.user._id;

  const chatPartnerIds = await Message.aggregate([
    // 1. Filter only messages involving the user
    {
      $match: {
        $or: [{ senderId: loggedInUser }, { receiverId: loggedInUser }],
      },
    },

    // 2. Project a single "partnerId" field based on who isn't the current user
    {
      $project: {
        partnerId: {
          $cond: {
            if: { $eq: ["$senderId", loggedInUser] },
            then: "$receiverId",
            else: "$senderId",
          },
        },
      },
    },

    // 3. Group by partnerId to get unique values ( replacing new Set() )
    {
      $group: { _id: "$partnerId" },
    },
  ]);

  const ids = chatPartnerIds.map((i) => i._id);

  const chatPartners = await User.find({ _id: { $in: ids } })
    .select("-password")
    .lean({ versionKey: false });

  res.status(200).json(chatPartners);
};
