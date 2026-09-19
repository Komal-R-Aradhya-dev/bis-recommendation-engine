require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  RAG_API_URL: process.env.RAG_API_URL,
  RAG_API_KEY: process.env.RAG_API_KEY,
};
