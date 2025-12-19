import "dotenv/config";
import express from "express";
import routes from "./routes/index.route";
import { join, resolve } from "path";

const app = express();
const PORT = process.env.PORT || 3000;

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

// App listen
app.listen(PORT, () => {
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
