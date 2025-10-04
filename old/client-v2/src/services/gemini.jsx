import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const genDescription = async (planet) => {
  console.log(API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(
      `generate short description for ${JSON.stringify(planet)}`
    );
    const response = result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return error.message;
  }
};
