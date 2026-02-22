import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with your API key (ensure this is in your .env file)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateQuestions = async (topic, count, type, hardness) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert test creator. Generate a test based on the following parameters:
      - Topic: ${topic}
      - Number of questions: ${count}
      - Question Type: ${type} (If MCQ, provide 4 options. If SAQ, provide an empty array for options).
      - Difficulty: ${hardness}

      Return the response EXCLUSIVELY as a strictly valid JSON array of objects. Do not use markdown blocks. Each object must have this exact structure:
      {
        "id": "unique_number",
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"], 
        "answer": "The correct answer or a brief short answer"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean up any potential markdown formatting the LLM might stubbornly add
    const cleanJson = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};
