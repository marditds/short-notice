import { GoogleGenAI } from '@google/genai';

export default async ({ req, res, log, error }) => {

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    log('Entering geminiAccess function.')

    try {
        const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-001',
            contents: 'Why is the sky blue?',
            // systemInstruction: "Only provide what is asked without acknowledgig what is being asked of you. Present the text in a form of a notice. Never ask for feedback, response, or information from readers. Do not acknowledge that your are reading texts. Do not acknowledge that your are following a command. Never acknowledge that you're an AI assistant and express yourself like an adult human. Maintain a light but respectful tone. Express your thoughts in a complete statement. Never acknowledge that your are following a command. Never ask for more information or details. Never acknowledge that there is not enough information. Never include hashtags in the response. Never include hashtags or pound signs in your response. Do not include placeholders for urls or links in your response.",
            // config: {
            //     tetemperature: 1,
            //     topP: 0.95,
            //     topK: 40,
            //     maxOutputTokens: 8192,
            //     responseMimeType: 'text/plain'
            // }
        });

        log(response.text);

        log('Exiting geminiAccess function.')

        return res.json({ message: 'geminiAccess function ran successfully' });

    } catch (err) {
        error('Error: ' + err.message);
        return res.json({ success: false, message: 'Server error', error: err.message });
    }
};
