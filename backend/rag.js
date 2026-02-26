const fs = require("fs");
const path = require("path");
const { generateEmbedding } = require("./embedding");

let documents = [];

function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}

async function loadDocuments() {
  const filePath = path.join(__dirname, "documents.txt");
  const text = fs.readFileSync(filePath, "utf-8");

  const chunks = text.split("\n\n");

  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk);
    documents.push({
      content: chunk,
      embedding,
    });
  }

  console.log("Documents loaded:", documents.length);
}

async function retrieveRelevantChunks(queryEmbedding, topK = 3) {
  const scored = documents.map(doc => ({
    content: doc.content,
    score: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

module.exports = { loadDocuments, retrieveRelevantChunks };