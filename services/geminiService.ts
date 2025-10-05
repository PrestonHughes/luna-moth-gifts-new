import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiSuggestion, Product } from '../types';

// The API key is injected by the build process.
// When running in an environment without this variable (like the AI Studio IDE),
// it falls back to a safe placeholder string to allow the app to initialize without errors.
const API_KEY = process.env.API_KEY ?? 'MISSING_API_KEY_IN_IDE';

let ai: GoogleGenAI | null = null;

/**
 * Returns a snippet of the API key for debugging purposes.
 * e.g., "AIza...kg_U"
 */
const getApiKeySnippet = (): string => {
    if (!API_KEY || API_KEY.length < 8 || API_KEY === 'MISSING_API_KEY_IN_IDE') {
        return "Not Available (IDE Mode)";
    }
    return `${API_KEY.substring(0, 4)}...${API_KEY.substring(API_KEY.length - 4)}`;
}

/**
 * Lazily initializes and returns the GoogleGenAI client.
 * Throws a specific, user-friendly error if the API key is missing or a placeholder.
 */
const getAiClient = (): GoogleGenAI => {
    if (API_KEY === 'MISSING_API_KEY_IN_IDE') {
        console.error("API_KEY is missing. The application was likely built without the API key or is running in an IDE.");
        throw new Error("AI Oracle is not configured. This feature is unavailable in the current environment.");
    }
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    return ai;
};

export const suggestCrystal = async (userInput: string, products: Product[]): Promise<GeminiSuggestion> => {

    const productInfoForPrompt = products.map(p => `id: ${p.id}, name: ${p.name}`).join('; ');

    const systemInstruction = `You are a knowledgeable gemologist specializing in the metaphysical properties of crystals. Your goal is to recommend a single, specific crystal, gemstone, or stone that best matches the user's stated need or desire.

We have the following crystals for sale, provided with their IDs: [${productInfoForPrompt}].

Please prioritize recommending a crystal from this list if it's a good match for the user's query.

Provide the name of the crystal, a brief one-to-two sentence description of its key properties relevant to the user's query, and if you recommended a crystal from our list, you MUST provide its corresponding ID in the 'productId' field.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            crystalName: {
                type: Type.STRING,
                description: "The name of the recommended crystal or stone."
            },
            description: {
                type: Type.STRING,
                description: "A short, one-to-two sentence description of its relevant metaphysical properties."
            },
            productId: {
                type: Type.STRING,
                description: "If the recommended crystal is from our product list, this is its ID. Otherwise, this field should be omitted or null."
            },
        },
        required: ["crystalName", "description"]
    };

    try {
        const client = getAiClient();
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `User's need: "${userInput}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
                temperature: 0.7,
            },
        });

        const jsonText = response.text.trim();
        if (!jsonText) {
            throw new Error("Received an empty response from the AI oracle.");
        }
        
        const parsedJson = JSON.parse(jsonText);

        if (parsedJson.crystalName && parsedJson.description) {
            return parsedJson as GeminiSuggestion;
        } else {
            throw new Error("Invalid response format from API.");
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // If the error is one of our specific configuration errors, re-throw it.
        if (error instanceof Error && error.message.startsWith("AI Oracle is not configured")) {
            throw error;
        }
        
        // For all other errors, wrap them in a new error that includes the original message
        // This helps surface issues like invalid API keys or permission problems.
        if (error instanceof Error) {
            const keySnippet = getApiKeySnippet();
            throw new Error(`The Oracle could not provide a suggestion. (Key used: ${keySnippet}) (Details: ${error.message})`);
        }

        // Fallback for non-Error objects
        throw new Error("Failed to get a suggestion. The stars may be misaligned due to an unknown issue.");
    }
};