const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const envPath = path.resolve(__dirname, "../.env");

if (fs.existsSync(envPath)) {
  console.log("backend/.env already exists; not overwriting.");
  process.exit(0);
}

const jwt = crypto.randomBytes(48).toString("hex");

fs.writeFileSync(
  envPath,
  [
    "PORT=5000",
    "MONGO_URI=mongodb://127.0.0.1:27017/bis-recommendation-engine",
    `JWT_SECRET=${jwt}`,
    "RAG_API_URL=",
    "RAG_API_KEY=",
    "",
  ].join("\n"),
);

console.log("Created backend/.env for local development. Secret values are not displayed.");
