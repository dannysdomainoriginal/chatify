import User from "@/models/User";
import { RequestHandler } from "express";
import createError from "http-errors";
import bcrypt from "bcrypt";
import { generateToken } from "@/lib/utils";
import { sendWelcomeMail } from "@/mail/emailHandlers";

type SignUpBody = Record<string, string | undefined>;

export const signup: RequestHandler = async (req, res) => {
  const { fullName, email, password } : SignUpBody = req.body || {};

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

    await sendWelcomeMail(newUser.email, newUser.fullName, process.env.CLIENT_URL!)
      .catch((err) => {
        console.error("Failed to send welcome email: ", err)
      })
    
    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      profilePic: newUser.profilePic,
      fullName: newUser.fullName,
    });
  }

  // generateToken(newUser.)
};
