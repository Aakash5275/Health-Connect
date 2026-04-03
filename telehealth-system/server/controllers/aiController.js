import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// AI Symptom Checker
export const checkSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.trim() === "") {
      return res.status(400).json({ error: "Symptoms are required" });
    }

    if (!GEMINI_API_KEY) {
      return res.json({
        symptoms,
        analysis: getDemoAnalysis(symptoms),
        disclaimer: "Demo response. Add GEMINI_API_KEY for real AI analysis."
      });
    }

    // ✅ Prompt mein strict JSON format maanga
    const prompt = `
You are a medical assistant AI helping rural patients understand their symptoms.

Respond ONLY with a valid JSON object. No markdown, no explanation outside JSON.

JSON format:
{
  "possibleConditions": ["condition1", "condition2", "condition3"],
  "severity": "mild" | "moderate" | "emergency",
  "advice": ["tip1", "tip2", "tip3"],
  "whenToSeeDoctor": ["reason1", "reason2"]
}

Patient symptoms: ${symptoms}
`;

    const response = await axios.post(
      `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const rawText =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // ✅ JSON parse karo — backticks/markdown clean karke
    let analysis;
    try {
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      analysis = JSON.parse(cleaned);
    } catch {
      // Parse fail hua toh raw text wapas bhejo
      return res.json({
        symptoms,
        analysis: { rawText },
        disclaimer: "Could not parse structured response."
      });
    }

    return res.json({
      symptoms,
      analysis,          // ✅ Ab structured object milega
      disclaimer: "AI generated advice. Please consult a doctor for accurate diagnosis."
    });

  } catch (error) {
    console.error("Gemini Error:", error?.response?.data || error.message);
    return res.status(500).json({
      error: "Failed to analyze symptoms",
      details: error?.response?.data || error.message
    });
  }
};

// Health Tips
export const getHealthTips = (req, res) => {
  try {
    const tips = [
      "Drink enough water",
      "Wash hands regularly",
      "Eat fruits and vegetables",
      "Sleep 7-8 hours",
      "Exercise daily",
      "Avoid smoking",
      "Keep surroundings clean",
      "Do regular health checkups"
    ];

    res.json({
      tips,
      dailyTip: tips[new Date().getDay() % tips.length]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};