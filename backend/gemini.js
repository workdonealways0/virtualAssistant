import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiUrl || !apiKey) {
      throw new Error("Missing GEMINI_API_URL or GEMINI_API_KEY in environment variables");
    }

    const prompt = `
You are a virtual assistant named ${assistantName} created by ${userName}.
You are NOT Google. You act like a voice-enabled assistant.

Respond ONLY with a JSON object like:
{
  "type": "general" | "google-search" | "youtube-search" | "youtube-play" |
           "get-time" | "get-date" | "get-day" | "get-month" |
           "calculator-open" | "instagram-open" | "facebook-open" | "weather-show",
  "userInput": "<cleaned user input (remove your name if present)>",
  "response": "<short spoken-friendly reply>"
}

Guidelines:
- Use "${userName}" if asked who created you.
- "type" = intent of user.
- "response" = short, natural voice response.
- Output ONLY the JSON, no text outside braces.

User said: ${command}
`;

    const result = await axios.post(
      apiUrl,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey, // ✅ new requirement
        },
      }
    );

    return (
      result.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Error: No valid response"
    );
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    return null;
  }
};

export default geminiResponse;
