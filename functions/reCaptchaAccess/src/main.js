import { Client, Users, Query } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
    // Initialize the Appwrite client
    const client = new Client()
        .setEndpoint(process.env.VITE_ENDPOINT) // Appwrite endpoint
        .setProject(process.env.VITE_PROJECT) // Project ID
        .setKey(process.env.SHORT_NOTICE_API_KEYS); // API Key for privileged access

    const users = new Users(client);

    try {
        log('Hello from reCaptchaAccess')

        return res.json("reCaptchaAccess function was run.");

    } catch (err) {
        error("Error occurred: " + err.message);
        return res.json({ success: false, message: err.message });
    }
};

