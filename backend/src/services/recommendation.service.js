const {
  getRecommendationsFromQuery,
  getRecommendationsFromTender,
} = require("./rag.service");

const RecommendationHistory = require("../models/RecommendationHistory");

const processRecommendationRequest = async ({ query, file, userId, limit }) => {
  let ragResponse;

  if (file) {
    ragResponse = await getRecommendationsFromTender({
      fileBuffer: file.buffer,
      fileName: file.originalname,
      query: query || "",
      limit,
    });
  } else {
    ragResponse = await getRecommendationsFromQuery({
      query,
      limit,
    });
  }

  const history = await RecommendationHistory.create({
    user: userId,
    query: query || (file ? file.originalname : ""),
    language: "en",
    hasDocument: Boolean(file),
    ragResponse,
  });

  return {
    ...ragResponse,
    historyId: history._id.toString(),
  };
};

const getUserHistory = async (userId) => {
  return RecommendationHistory.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(20);
};

const deleteUserHistory = async (historyId, userId) => {
  const history = await RecommendationHistory.findOne({
    _id: historyId,
    user: userId,
  });

  if (!history) {
    const error = new Error("History record not found.");
    error.statusCode = 404;
    throw error;
  }

  await RecommendationHistory.deleteOne({
    _id: historyId,
    user: userId,
  });

  return {
    id: historyId,
  };
};

module.exports = {
  processRecommendationRequest,
  getUserHistory,
  deleteUserHistory,
};
