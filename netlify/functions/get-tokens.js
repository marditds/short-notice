exports.handler = async (event) => {
    try {
        console.log("Received request:", event);

        if (!event.queryStringParameters) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No query parameters provided" })
            };
        }

        const params = new URLSearchParams(event.queryStringParameters);
        const keyType = params.get("key");

        if (!keyType) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing key type" })
            };
        }

        let response = {};
        switch (keyType) {
            case "google":
                response = { token: process.env.GOOGLE_API_TOKEN || "MISSING_GOOGLE_API_TOKEN" };
                break;
            case "captcha":
                response = { token: process.env.CAPTCHA_SITE_KEY || "CAPTCHA_SITE_KEY" };
                break;
            case "gemini":
                response = { token: process.env.GEMINI_API_KEY || "MISSING_GEMINI_API_KEY" };
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
    } catch (error) {
        console.error("Error in function:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
};

// exports.handler = async () => {
//     return {
//         statusCode: 200,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token: process.env.GOOGLE_API_TOKEN || "MISSING_ENV_VAR" })
//     };
// };