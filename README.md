# 🚀 RAG Assistant Backend

A production-ready Retrieval-Augmented Generation (RAG) backend built with:

- Node.js
- Express
- Google Gemini API
- Vector Embeddings
- Cosine Similarity Search
- Session-based Memory

---

# 🧠 What is RAG?

RAG (Retrieval-Augmented Generation) improves LLM accuracy by retrieving relevant knowledge before generating a response.

Instead of relying purely on model memory, the system:

1. Converts the query into an embedding
2. Finds similar document chunks
3. Injects retrieved context into the prompt
4. Generates a grounded response

This reduces hallucinations and improves factual accuracy.

---

# 🏗 System Architecture

```mermaid
flowchart LR
    A[User Request] --> B[Express API]
    B --> C[Generate Query Embedding]
    C --> D[Vector Similarity Search]
    D --> E[Retrieve Top K Chunks]
    E --> F[Build Context + History]
    F --> G[Gemini LLM]
    G --> H[Response]
