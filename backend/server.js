require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/aiflow")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Mongoose Schema
const flowSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Flow = mongoose.model("Flow", flowSchema);

// POST /api/ask-ai
app.post("/api/ask-ai", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const openRouterRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:3000",
          "X-Title": "AI Flow App",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [{ role: "user", content: prompt }],
        }),
      },
    );

    if (!openRouterRes.ok) {
      const errText = await openRouterRes.text();
      console.error("OpenRouter error:", errText);
      return res
        .status(502)
        .json({ error: "AI service error. Check your API key." });
    }

    const data = await openRouterRes.json();
    const answer =
      data.choices?.[0]?.message?.content || "No response from AI.";

    res.json({ answer });
  } catch (err) {
    console.error("Error calling OpenRouter:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// POST /api/save
app.post("/api/save", async (req, res) => {
  const { prompt, response } = req.body;

  if (!prompt || !response) {
    return res.status(400).json({ error: "Prompt and response are required." });
  }

  try {
    const flow = new Flow({ prompt, response });
    await flow.save();
    res.json({ message: "Saved successfully!", id: flow._id });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: "Failed to save to database." });
  }
});

// GET /api/history
app.get("/api/history", async (req, res) => {
  try {
    const flows = await Flow.find().sort({ createdAt: -1 }).limit(20);
    res.json(flows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
