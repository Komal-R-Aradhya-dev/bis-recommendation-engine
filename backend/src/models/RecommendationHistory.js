const mongoose = require("mongoose");

const recommendationHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    query: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      default: "en",
    },

    hasDocument: {
      type: Boolean,
      default: false,
    },

    ragResponse: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "RecommendationHistory",
  recommendationHistorySchema,
);
