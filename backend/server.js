const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");
const { generateEmbedding } = require("./embedding");
const { loadDocuments, retrieveRelevantChunks } = require("./rag");
const { getSession, addMessage } = require("./sessionStore");

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

// Load documents at startup
loadDocuments();

app.post("/api/chat", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // 1️⃣ Embed query
    const queryEmbedding = await generateEmbedding(message);

    // 2️⃣ Retrieve relevant chunks
    const relevantChunks = await retrieveRelevantChunks(queryEmbedding);

    const threshold = 0.65;

    if (!relevantChunks.length || relevantChunks[0].score < threshold) {
      return res.json({
        reply: "Sorry, I don't have information about that.",
        retrievedChunks: 0,
      });
    }

    // 3️⃣ Build context
    const context = relevantChunks.map(c => c.content).join("\n");

    // 4️⃣ Conversation history
    const history = getSession(sessionId)
      .map(m => `${m.role}: ${m.content}`)
      .join("\n");

    const prompt = `
You are a helpful assistant.
Answer ONLY using the provided context.
If answer is not in context, say you don't know.

Context:
${context}

Conversation History:
${history}

User Question:
${message}
`;

    // 5️⃣ Call Gemini
    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const reply = response.text;

    // 6️⃣ Save session
    addMessage(sessionId, "user", message);
    addMessage(sessionId, "assistant", reply);

    res.json({
      reply,
      retrievedChunks: relevantChunks.length,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error or API failure"
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});