exports.handler = async (event) => {
    const params = new URLSearchParams(event.queryStringParameters);
    const keyType = params.get("key");

    let response = {};

    switch (keyType) {
        case "google":
            response = { token: process.env.GOOGLE_API_TOKEN || "MISSING_GOOGLE_API_TOKEN" };
            break;
        case "captcha":
            response = { token: process.env.CAPTCHA_SITE_KEY || "MISSING_CAPTCHA_SITE_KEY" };
            break;
        case "gemini":
            response = { token: process.env.GEMINI_API_KEY || "MISSING_GEMINI_API_KEY" };
            break;
        case "tenor":
            response = { token: process.env.TENOR_API_KEY || "MISSING_GEMINI_API_KEY" };
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