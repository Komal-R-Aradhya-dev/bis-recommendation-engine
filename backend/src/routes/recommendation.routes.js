const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const {
  getRecommendationsHandler,
  getHistoryHandler,
  deleteHistoryHandler,
} = require("../controllers/recommendation.controller");

router.post("/", protect, upload.single("document"), getRecommendationsHandler);

router.get("/history", protect, getHistoryHandler);

router.delete("/history/:id", protect, deleteHistoryHandler);

module.exports = router;
