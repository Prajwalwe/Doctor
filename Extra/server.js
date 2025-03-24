require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Patient Schema & Model
const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  symptoms: String,
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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
