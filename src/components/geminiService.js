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
// export const generateQuestions = async (topic, count, type, hardness) => {
//   try {
//     const prompt = `
//       You are an expert test creator. Generate a test based on the following parameters:
//       - Topic: ${topic}
//       - Number of questions: ${count}
//       - Question Type: ${type} (If MCQ, provide 4 options. If SAQ, provide an empty array for options).
//       - Difficulty: ${hardness}

//       Return the response EXCLUSIVELY as a strictly valid JSON array of objects. Do not use markdown blocks. Each object must have this exact structure:
//       {
//         "id": "unique_number",
//         "question": "The question text",
//         "options": ["Option A", "Option B", "Option C", "Option D"], 
//         "answer": "The correct answer or a brief short answer"
//       }
//     `;

//     const response = await fetch(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json",
//           // Optional but recommended by OpenRouter for analytics and visibility
//           "HTTP-Referer": window.location.origin,
//           "X-Title": "Quiz Generator App",
//         },
//         body: JSON.stringify({
//           model: "arcee-ai/trinity-large-preview:free",
//           messages: [{ role: "user", content: prompt }],
//         }),
//       },
//     );

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(
//         `OpenRouter API error: ${response.status} - ${JSON.stringify(errorData)}`,
//       );
//     }

//     const data = await response.json();
//     const responseText = data.choices[0].message.content;

//     // Clean up any potential markdown formatting the LLM might stubbornly add
//     const cleanJson = responseText
//       .replace(/```json/gi, "")
//       .replace(/```/g, "")
//       .trim();

//     return JSON.parse(cleanJson);
//   } catch (error) {
//     console.error("Error generating questions:", error);
//     throw error;
//   }
// };