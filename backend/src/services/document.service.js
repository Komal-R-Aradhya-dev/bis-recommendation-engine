const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");

const extractTextFromFile = async (file) => {
  if (!file) {
    return null;
  }

  const ext = path.extname(file.originalname).toLowerCase();
  const isPdf = file.mimetype === "application/pdf" || ext === ".pdf";
  const isDocx =
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ext === ".docx";

  if (isPdf) {
    const parser = new PDFParse({ data: file.buffer });
    const result = await parser.getText();
    return result.text;
  }

  if (isDocx) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  throw new Error("Unsupported file type");
};

module.exports = { extractTextFromFile };
