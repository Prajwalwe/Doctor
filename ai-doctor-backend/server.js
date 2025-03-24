require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Patient Schema & Model
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  history: String,
  conditions: String,
  medications: String,
  testResults: String,
});

const Patient = mongoose.model("Patient", patientSchema);

// Root Route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// ✅ API to Fetch Patient by Name
app.get("/patients/name/:name", async (req, res) => {
  try {
    const patient = await Patient.findOne({ name: req.params.name });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: "Error fetching patient data" });
  }
});

// ✅ API to Add New Patient
app.post("/patients", async (req, res) => {
  try {
    const { name, age, gender, history, conditions, medications, testResults } = req.body;

    // Validate required fields
    if (!name || !age || !gender) {
      return res.status(400).json({ error: "Name, age, and gender are required fields." });
    }

    // Create new patient entry
    const newPatient = new Patient({
      name,
      age,
      gender,
      history,
      conditions,
      medications,
      testResults,
    });

    await newPatient.save();
    res.json({ message: "✅ Patient added successfully!", patient: newPatient });
  } catch (error) {
    console.error("❌ Error adding patient:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
