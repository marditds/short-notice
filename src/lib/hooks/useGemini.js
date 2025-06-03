import { generateNoticeTemplateWithGemini } from "../context/dbhandler";

export const useGemini = () => {

    const runGemini = async (prompt) => {

        const chatSession = await generateNoticeTemplateWithGemini(prompt);

        console.log('chatSession', chatSession);

        return chatSession;
    }

    return { runGemini }
}