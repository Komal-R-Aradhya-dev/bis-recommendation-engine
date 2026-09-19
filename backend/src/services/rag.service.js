const axios = require("axios");
const FormData = require("form-data");
const { RAG_API_URL, RAG_TIMEOUT_MS } = require("../config/rag");

const mapAxiosError = (error) => {
  if (error.code === "ECONNABORTED") {
    const e = new Error("RAG service timed out. Please try again.");
    e.statusCode = 504;
    return e;
  }
  if (error.response) {
    const e = new Error(
      error.response.data?.message || "RAG service returned an error",
    );
    e.statusCode = error.response.status || 502;
    return e;
  }
  const e = new Error("Unable to reach RAG service");
  e.statusCode = 502;
  return e;
};

// Text-only query -> POST /recommend/llm (form-urlencoded)
const getRecommendationsFromQuery = async ({ query, limit = 5 }) => {
  try {
    const params = new URLSearchParams();
    params.append("query", query);
    params.append("limit", limit);

    const response = await axios.post(`${RAG_API_URL}/recommend/llm`, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: RAG_TIMEOUT_MS,
    });
    return response.data;
  } catch (error) {
    throw mapAxiosError(error);
  }
};

// Tender PDF -> POST /recommend/llm/tender (multipart/form-data)
const getRecommendationsFromTender = async ({
  fileBuffer,
  fileName,
  query = "",
  limit = 5,
}) => {
  try {
    const formData = new FormData();
    formData.append("file", fileBuffer, fileName);
    if (query) formData.append("query", query);
    formData.append("limit", limit);

    const response = await axios.post(
      `${RAG_API_URL}/recommend/llm/tender`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: RAG_TIMEOUT_MS,
      },
    );
    return response.data;
  } catch (error) {
    throw mapAxiosError(error);
  }
};

module.exports = { getRecommendationsFromQuery, getRecommendationsFromTender };
