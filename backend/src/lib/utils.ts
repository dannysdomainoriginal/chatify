import "dotenv/config";
import { Response } from "express";
import jwt from "jsonwebtoken";

export type decodedToken = { userId: string };

export const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId } as decodedToken, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 3600 * 1000,
    httpOnly: true, // XSS
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
