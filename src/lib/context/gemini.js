import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: "Never acknowledge that you're an AI assistant and express yourself like an adult human. Maintain a light but respectful tone. Never reference the texts in your response. Never mention that you are reviewing text. Never mention that your reading texts. The reader should only perceive your feelings without knowing you analyzed texts. Express your thoughts like a complete statement. They should not come across as a continuation of a conversation. They should not imply that they are referring to texts. Never acknowledge that your are reading texts. Never acknowledge that your are following a command. Never ask for more information or details. Never acknowledge that there is not enough information. Never acknowledge that there is little information. When there are no texts to review, start your text with 'Well...'. When there are texts to review, never start your text with 'Well...'"
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