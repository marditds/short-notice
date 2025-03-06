// export const keysProvider = (key, setFunction) => {
//     fetch(`/.netlify/functions/get-tokens?key=${key}`)
//         .then((res) => res.json())
//         .then((data) => setFunction(data.token))
//         .catch((err) => console.error(`Error fetching ${key} tokens:`, err));
// } 


export const keysProvider = (key, setFunction) => {
    // Check if running in development mode (local environment)
    if (import.meta.env.DEV) {
        // Construct the local environment variable name dynamically
        const localKeyMap = {
            google: "VITE_GOOGLE_API_TOKEN",
            captcha: "VITE_CAPTCHA_SITE_KEY",
            gemini: "VITE_GEMINI_API_KEY",
            tenor: "VITE_TENOR_API_KEY"
        };

        const localKey = import.meta.env[localKeyMap[key]];
        if (localKey) {
            setFunction(localKey);
            return;
        }
    }

    // If not in local mode, fetch from Netlify serverless function
    fetch(`/.netlify/functions/get-tokens?key=${key}`)
        .then((res) => res.json())
        .then((data) => setFunction(data.token))
        .catch((err) => console.error(`Error fetching ${key} tokens:`, err));
};

