export const keysProvider = (key, setFunction) => {
    fetch(`/.netlify/functions/get-tokens?key=${key}`)
        .then((res) => res.json())
        .then((data) => setFunction(data.token))
        .catch((err) => console.error(`Error fetching ${key} tokens:`, err));
} 