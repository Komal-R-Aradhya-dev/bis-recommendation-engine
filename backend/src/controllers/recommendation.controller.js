const {
  processRecommendationRequest,
  getUserHistory,
  deleteUserHistory,
} = require("../services/recommendation.service");

const getRecommendationsHandler = async (req, res, next) => {
  try {
    const { query } = req.body;
    const file = req.file;

    if ((!query || query.trim().length === 0) && !file) {
      return res.status(400).json({
        success: false,
        errors: {
          query: "Either a query or a document is required",
        },
      });
    }

    const userId = req.user.id;
    const limit = req.body.limit ? Number(req.body.limit) : 5;

    const result = await processRecommendationRequest({
      query,
      file,
      userId,
      limit,
    });

    res.status(200).json({
      success: true,
      message: "Recommendations generated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getHistoryHandler = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const history = await getUserHistory(userId);

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

const deleteHistoryHandler = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "History ID is required",
      });
    }

    const result = await deleteUserHistory(id, userId);

    res.status(200).json({
      success: true,
      message: "History deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendationsHandler,
  getHistoryHandler,
  deleteHistoryHandler,
};
