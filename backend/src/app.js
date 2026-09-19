const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth.routes");
const recommendationRoutes = require("./routes/recommendation.routes");
const errorHandler = require("./middleware/error.middleware");
const reportRoutes = require("./routes/report.routes");

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Custom sanitizer: strips MongoDB operator keys from req.body
const sanitizeBody = (req, res, next) => {
  const clean = (obj) => {
    if (obj && typeof obj === "object") {
      for (const key in obj) {
        if (key.startsWith("$") || key.includes(".")) {
          delete obj[key];
        } else {
          clean(obj[key]);
        }
      }
    }
  };
  clean(req.body);
  next();
};

app.use(sanitizeBody);

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    message: "Too many attempts, please try again later",
  },
});

const recommendationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

// Test route
app.get("/", (req, res) => {
  res.send("BIS Recommendation Engine API is running");
});

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/recommendations", recommendationLimiter, recommendationRoutes);
app.use("/api/reports", reportRoutes);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
