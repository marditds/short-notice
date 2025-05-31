// for components use only
export const keysProvider = (key, setFunction) => {

    if (import.meta.env.DEV) {
        const localKeyMap = {
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

    fetch(`/.netlify/functions/get-tokens?key=${key}`)
        .then((res) => res.json())
        .then((data) => setFunction(data.value))
        .catch((err) => console.error(`Error fetching ${key} tokens:`, err));
};

// for dbhandler use only
export const dbFunctionKeysProvider = async (key) => {

    if (import.meta.env.DEV) {
        const localKeyMap = {
            user_auth_function: "VITE_USER_AUTH_FUNCTION_ID",
            user_delete_function: "VITE_USER_DELETE_FUNCTION_ID"
        };

        const localKey = import.meta.env[localKeyMap[key]];
        if (localKey) {
            return localKey;
        }

    }

    try {
        const res = await fetch(`/.netlify/functions/get-tokens?key=${key}`);
        const data = await res.json();
        return data.value;
    } catch (err) {
        console.error(`Error fetching ${key} token:`, err);
        return null;
    }

    // fetch(`/.netlify/functions/get-tokens?key=${key}`)
    //     .then((res) => res.json())
    //     .then((data) => return data.value)
    //     .catch((err) => console.error(`Error fetching ${key} tokens:`, err));
};

