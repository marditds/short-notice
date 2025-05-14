exports.handler = async (event) => {
    const params = new URLSearchParams(event.queryStringParameters);
    const keyType = params.get("key");

    let response = {};

    switch (keyType) {
        case "google":
            response = { value: process.env.GOOGLE_API_TOKEN || "MISSING_GOOGLE_API_TOKEN" };
            break;
        case "captcha":
            response = { value: process.env.CAPTCHA_SITE_KEY || "MISSING_CAPTCHA_SITE_KEY" };
            break;
        case "gemini":
            response = { value: process.env.GEMINI_API_KEY || "MISSING_GEMINI_API_KEY" };
            break;
        case "tenor":
            response = { value: process.env.TENOR_API_KEY || "MISSING_TENOR_API_KEY" };
            break;
        case "user_auth_function":
            response = { value: process.env.USER_AUTH_FUNCTION_ID || "MISSING_USER_AUTH_FUNCTION_ID" };
            break;
        case "user_delete_function":
            response = { value: process.env.USER_DELETE_FUNCTION_ID || "MISSING_USER_DELETE_FUNCTION_ID" };
            break;
        case "user_session_function":
            response = { value: process.env.USER_SESSION_FUNCTION_ID || "MISSING_USER_SESSION_FUNCTION_ID" };
            break;
        default:
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid key type requested" })
            };
    }

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response)
    };
};