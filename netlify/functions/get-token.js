exports.handler = async () => {
    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" }, // Ensure JSON response
        body: JSON.stringify({ token: process.env.GOOGLE_API_TOKEN || "MISSING_ENV_VAR" }) // Debugging fallback
    };
};