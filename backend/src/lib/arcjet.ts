import "dotenv/config";
import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),

    // Create a bot detection rule
    detectBot({
      mode: "LIVE", // Blocks requests.
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR", "CATEGORY:PREVIEW"],
    }),

    // Create a slidingWindow rate limit.
    slidingWindow({
      mode: "LIVE",
      max: 100,
      interval: 60, // 1 minute
    }),
  ],
});
