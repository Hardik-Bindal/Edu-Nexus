import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateQuizWithAI = async (topic, difficulty, numQuestions = 5) => {
  try {
    const prompt = `
    Generate ${numQuestions} multiple-choice questions about "${topic}" with difficulty "${difficulty}".
    Each question must have exactly 4 options, 1 correct answer, and a short explanation.
    Format the response as valid JSON:
    [
      {
        "questionText": "string",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": "string",
        "explanation": "string"
      }
    ]
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const raw = response.choices[0].message.content.trim();
    const cleanJson = raw.replace(/```json|```/g, "").trim();

    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("❌ AI Quiz generation failed:", error.message);
    throw new Error("AI quiz generation failed.");
  }
};

export const generateStudyMaterial = async (topic, level) => {
  try {
    const prompt = `
    Create a short, structured study material for students about "${topic}" at the "${level}" level.
    Include:
    - Summary
    - Key Points
    - Example(s)
    - Suggested Practice Question
    Format as plain text.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("❌ AI Study material generation failed:", error.message);
    throw new Error("AI study material generation failed.");
  }
};

// 📌 Generate a fun fact
export const generateFactWithAI = async () => {
  try {
    const prompt = `
    Give me 1 interesting "Did you know?" fact related to science, environment, history, or general knowledge.
    Keep it short and under 30 words. No intro text, just the fact.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const fact = response.choices[0].message.content.trim();
    return fact;
  } catch (err) {
    console.error("❌ AI Fact generation failed:", err.message);
    return "Did you know? The honeybee is the only insect that produces food eaten by humans.";
  }
};
