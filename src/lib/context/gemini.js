import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: "Do not acknowledge that you're an AI assistant and express yourself like an adult human. Maintain a light but respectful tone. Do not reference the texts in your response. Do not mention that you are reviewing text. Do not mention that your reading or reviewing texts. The reader should only perceive your feelings without knowing you analyzed texts. Express your thoughts like a complete statement. They should not come across as a continuation of a conversation. They should not imply that they are referring to texts."
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export async function runGemini(prompt) {
    const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const result = await chatSession.sendMessage(prompt);
    console.log(result.response.text());
    return result.response.text();
}

// export default runGemini;