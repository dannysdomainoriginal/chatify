import { aj as arcject } from "@/lib/arcjet";
import { isSpoofedBot } from "@arcjet/inspect";
import { RequestHandler } from "express";
import createError from "http-errors";

export const arcjectProtection: RequestHandler = async (req, res, next) => {
  const decision = await arcject.protect(req)
    .catch((err) => {
    throw createError.InternalServerError(
      "Something went wrong with the Arcject projection middleware"
    );
  });

  if (isDenied()) {
    if (reason.isRateLimit()) {
      throw createError.TooManyRequests(
        "Rate limit exceeded. Please try again later"
      );
    } else if (reason.isBot()) {
      throw createError(403, "Bot access denied");
    } else {
      throw createError(403, "Access denied by security policy");
    }
  }

  // check for spoofed bots
  if (results.some(isSpoofedBot)) {
    return res.status(403).json({
      error: "Spoofed bot detected",
      message: "Malicious bot activity detected"
    })
  }

  next()
};
