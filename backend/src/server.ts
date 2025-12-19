import "dotenv/config";
import express from "express";
import routes from "./routes/index.route";

const app = express();
const PORT = process.env.PORT || 3000;

// Route management abstraction layer
app.use("/api", routes);

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
