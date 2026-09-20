const mongoose = require("mongoose");
const { MONGO_URI } = require("./env");

const isUsableUri = (value) =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  !value.includes("<YOUR_");

const connectDB = async () => {
  if (!isUsableUri(MONGO_URI)) {
    console.error(
      "MongoDB connection failed: MONGO_URI is required and must be supplied by the developer.",
    );
    console.error(
      "Copy backend/.env.example to backend/.env and set MONGO_URI (and the other local values).",
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
