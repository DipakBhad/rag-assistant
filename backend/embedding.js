const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateEmbedding(text) {
  const response = await genAI.models.embedContent({
    model: "embedding-001",
    contents: text,
  });

  return response.embedding.values;
}

module.exports = { generateEmbedding };