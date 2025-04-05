import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { keysProvider } from "../context/keysProvider";

export const useGemini = () => {

    const [geminiKey, setGeminiKey] = useState(null);

    useEffect(() => {
        keysProvider('gemini', setGeminiKey);
    }, []);

    const genAI = new GoogleGenerativeAI(geminiKey);

    const model = genAI ? genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: "Only provide what is asked without acknowledgig what is being asked of you. Present the text in a form of a notice. Never ask for feedback, response, or information from readers. Do not acknowledge that your are reading texts. Do not acknowledge that your are following a command. Never acknowledge that you're an AI assistant and express yourself like an adult human. Maintain a light but respectful tone. Express your thoughts in a complete statement. Never acknowledge that your are following a command. Never ask for more information or details. Never acknowledge that there is not enough information. Never include hashtags in the response. Never include hashtags or pound signs in your response. Do not include placeholders for urls or links in your response."
    }) : null;

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };

    const runGemini = async (prompt) => {

        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        const result = await chatSession.sendMessage(prompt);
        console.log(result.response.text());
        return result.response.text();
    }

    return { runGemini }
}