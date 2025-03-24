const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const PatientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  symptoms: String,
  history: String,
});

const Patient = mongoose.model("Patient", PatientSchema);

// OpenAI API setup
const openai = new OpenAI({ apiKey: process.env.AIzaSyALWlbXC2RpSrGqzSr7Ubjm_UwSY8W7IbY});

// API to take patient info & generate explanation
app.post("/analyze", async (req, res) => {
  const { name, age, symptoms, history } = req.body;

  const patient = new Patient({ name, age, symptoms, history });
  await patient.save();

  const prompt = `Patient Details:\nName: ${name}\nAge: ${age}\nSymptoms: ${symptoms}\nHistory: ${history}\n\nProvide a brief medical explanation.`;
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "system", content: prompt }],
  });

  res.json({ analysis: response.choices[0].message.content });
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
