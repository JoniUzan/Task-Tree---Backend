const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db");
const { verifyToken } = require("./middeleware/auth-middeleware");

dotenv.config(); // Load config

async function main() {
  // Connect to database
  await connectDB();

  // MIDDLEWARES
  // parse json body in request (for POST, PUT, PATCH requests)
  app.use(express.json());

  // allow CORS for local development (for production, you should configure it properly)
  app.use(cors());

  // Routes

  const authRoutes = require("./routes/auth-routes");
  const tasksRoutes = require("./routes/tasks-routes");
  const userRoutes = require("./routes/user-routes");

  app.use("/api/auth", authRoutes);
  app.use("/api/tasks", verifyToken, tasksRoutes);
  app.use("/api/loggedInUser", verifyToken, userRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main();
