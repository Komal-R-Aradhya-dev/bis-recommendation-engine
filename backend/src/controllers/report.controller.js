const mongoose = require("mongoose");

const RecommendationHistory = require("../models/RecommendationHistory");
const { createPdfBuffer } = require("../services/report.service");

const generateReportHandler = async (req, res, next) => {
  try {
    const { historyId } = req.body;
    const userId = req.user.id;

    if (!historyId) {
      return res.status(400).json({
        success: false,
        message: "historyId is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(historyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid historyId",
      });
    }

    const history = await RecommendationHistory.findOne({
      _id: historyId,
      user: userId,
    });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "History record not found",
      });
    }

    const pdfBuffer = await createPdfBuffer(history);

    const fileName = `BIS-Recommendation-Report-${String(history._id)}.pdf`;

    res.status(200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateReportHandler,
};
