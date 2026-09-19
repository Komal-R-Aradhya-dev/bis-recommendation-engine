const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const { generateReportHandler } = require("../controllers/report.controller");

router.post("/", protect, generateReportHandler);

module.exports = router;
