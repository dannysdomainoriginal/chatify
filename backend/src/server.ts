import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import routes from "./routes/index.route";
import { join } from "path";
import { connectDB } from "./lib/db";
import parser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(parser());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "50kb" }));

// Route management abstraction layer
app.use("/api", routes);

// Handle Sevalla setup
if (process.env.NODE_ENV == "production") {
  app.use(express.static(join(__dirname, "..", "..", "frontend", "dist")));

  // send index.html
  app.use((req, res) => {
    res.sendFile(join(__dirname, "..", "..", "frontend", "dist", "index.html"));
  });
}

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  console.log(err)

  res.status(status).json({
    status,
    message: err.message || "Something went wrong",
  });
});

// App listen
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server listening on port ${PORT}`);
});

// Catches unexpected runtime failures
process.on("uncaughtException", async (err, origin) => {
  console.log(err.stack);
  process.exit(1);
});

process.on("unhandledRejection", async (err: Error) => {
  console.log(err.stack);
  process.exit(1);
});
