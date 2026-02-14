
import OpenAI from "openai";

// Assuming OPENAI_API_KEY is in your .env
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
