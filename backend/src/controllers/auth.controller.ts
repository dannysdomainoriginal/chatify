import User from "@/models/User";
import { RequestHandler } from "express";
import createError from "http-errors";
import bcrypt from "bcrypt";
import { generateToken } from "@/lib/utils";
import { sendWelcomeMail } from "@/mail/emailHandlers";
import cloudinary from "@/lib/cloudinary";

type SignUpBody = {
  fullName: string;
  email: string;
  password: string;
};

export const signup: RequestHandler = async (req, res) => {
  const { fullName, email, password }: SignUpBody = req.body || {};
  console.log(req.body)
  if (!fullName || !email || !password)
    throw createError.BadRequest("All fields are required");

  if (password.length < 6)
    throw createError.BadRequest("Password must be at least 6 characters");

  // check if email is valid: regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    throw createError.BadRequest("Invalid email format");

  const user = await User.findOne({ email });
  if (user) throw createError.Conflict("Email already exists");

  const hashed = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    fullName,
    email,
    password: hashed,
  }).catch((err) => {
    if (err.name === "ValidationError") {
      // Take the first validation error message
      const { message } = Object.values(err.errors)[0] as { message: string };
      throw createError.UnprocessableEntity(message || "Invalid data passed");
    }

    // For other errors, just rethrow to go to groundlevel
    throw err;
  });

  if (newUser) {
    generateToken(newUser._id.toString(), res);

    // * Send welcome email async, doesn't delay response
    sendWelcomeMail(
      newUser.email,
      newUser.fullName,
      process.env.CLIENT_URL!
    ).catch((err) => {
      console.error("Failed to send welcome email: ", err);
    });

    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      profilePic: newUser.profilePic,
      fullName: newUser.fullName,
    });
  }
};

/* -------------------------------------------------------------------------- */

type LoginBody = {
  email: string;
  password: string;
};

export const login: RequestHandler = async (req, res) => {
  const { email, password }: LoginBody = req.body;

  if (!email || !password)
    throw createError.BadRequest("Email and password are required");

  const user = await User.findOne({ email });
  if (!user) throw createError.BadRequest("Invalid credentials");

  const passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) throw createError.BadRequest("Invalid credentials");

  if (user) {
    generateToken(user._id.toString(), res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  }
};

/* -------------------------------------------------------------------------- */

export const logout: RequestHandler = (_, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

/* -------------------------------------------------------------------------- */

type updateProfileBody = {
  profilePic: any;
};

export const updateProfile: RequestHandler = async (req, res) => {
  const { profilePic } : updateProfileBody = req.body;
  if (!profilePic) throw createError.BadRequest("Profile pic is required");

  const { _id: id } = req.user;
  const { secure_url: url } = await cloudinary.uploader.upload(profilePic);

  const user = await User.findByIdAndUpdate(
    id,
    {
      profilePic: url,
    },
    { new: true }
  );

  res.status(200).json(user)
};
