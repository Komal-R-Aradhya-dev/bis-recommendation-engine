const validateRecommendationInput = (data) => {
  const errors = {};

  const hasQuery = data.query && data.query.trim().length > 0;
  const hasDocumentText =
    data.documentText && data.documentText.trim().length > 0;

  if (!hasQuery && !hasDocumentText) {
    errors.query = "Either a query or a document is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = { validateRecommendationInput };
