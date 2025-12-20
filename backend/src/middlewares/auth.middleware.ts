import "dotenv/config";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import createError from "http-errors";
import { Request, RequestHandler } from "express";
import type from "types/cookie";
import { decodedToken } from "@/lib/utils";

export const protectRoute: RequestHandler = async (req: Request, res, next) => {
  const token = req.cookies.jwt;
  if (!token)
    throw createError.Unauthorized("401 Unauthorized - No token provided");

  const decoded = jwt.verify(token, process.env.JWT_SECRET) as decodedToken;

  if (!decoded)
    throw createError.Forbidden("403 Forbidden - Your token is invalid");

  const user = await User.findById(decoded.userId)
    .select("-password")
    .lean({ versionKey: false });
  if (!user) throw createError.NotFound("No user exists with the given ID");

  req.user = user;
  next();
};
