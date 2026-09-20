const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

if (!process.env.JWT_SECRET) {
  console.warn(
    "JWT_SECRET is not set. Authentication will fail until it is supplied.",
  );
}

if (!process.env.RAG_API_URL) {
  console.warn(
    "RAG_API_URL is not set. Recommendation requests will fail until it is supplied.",
  );
}

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  RAG_API_URL: process.env.RAG_API_URL,
  RAG_API_KEY: process.env.RAG_API_KEY,
};
