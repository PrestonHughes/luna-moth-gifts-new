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

const imageResponseSchema = {
    type: Type.OBJECT,
    properties: {
        crystalName: {
            type: Type.STRING,
            description: "The name of the identified crystal or stone."
        },
        description: {
            type: Type.STRING,
            description: "A short, one-to-two sentence description of its relevant metaphysical properties."
        },
        productId: {
            type: Type.STRING,
            description: "If the identified crystal is from our product list, this is its ID. Otherwise, this field should be omitted or null."
        },
        category: {
            type: Type.STRING,
            description: "The most relevant product category from the provided list for the identified stone (e.g., 'Raw Stones', 'Jewelry', 'Clusters'). This should be provided even if no specific product matches."
        }
    },
    required: ["crystalName", "description"]
};


export const suggestCrystal = async (userInput: string, products: Product[]): Promise<GeminiSuggestion> => {

    const productInfoForPrompt = products.map(p => `id: ${p.id}, name: ${p.name}`).join('; ');

    const systemInstruction = `You are a knowledgeable gemologist specializing in the metaphysical properties of crystals. Your goal is to recommend a single, specific crystal, gemstone, or stone that best matches the user's stated need or desire.

We have the following crystals for sale, provided with their IDs: [${productInfoForPrompt}].

Please prioritize recommending a crystal from this list if it's a good match for the user's query.

Provide the name of the crystal, a brief one-to-two sentence description of its key properties relevant to the user's query, and if you recommended a crystal from our list, you MUST provide its corresponding ID in the 'productId' field.`;

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


export const identifyCrystalFromImage = async (base64ImageData: string, products: Product[]): Promise<GeminiSuggestion> => {
    
    const productInfoForPrompt = products.map(p => `id: ${p.id}, name: ${p.name}`).join('; ');
    const categoriesForPrompt = Array.from(new Set(products.map(p => p.category))).join(', ');

    const systemInstruction = `You are an expert gemologist. Your primary and most important goal is to accurately identify the main crystal or stone in the provided image.

First, identify the stone with the highest possible accuracy, based only on its visual characteristics.

Second, after you have made your identification, look at the following list of crystals we have for sale: [${productInfoForPrompt}]. If your identification matches a product in our list, provide its corresponding ID in the 'productId' field. If it does not match anything in our list, do not provide a 'productId'.

Third, determine which of our store's product categories is the most appropriate for the identified stone. Here are our available categories: [${categoriesForPrompt}]. You MUST provide the best matching category name in the 'category' field.

Finally, provide the identified crystal's name and a brief one-to-two sentence description of its key properties.`;

    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64ImageData,
        },
    };

    const textPart = {
        text: "Please identify the crystal in this image and then check if it matches a product from the provided list.",
    };

    try {
        const client = getAiClient();
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: imageResponseSchema,
                temperature: 0.2, // Lower temperature for more deterministic identification
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
        console.error("Error calling Gemini API for image identification:", error);
        if (error instanceof Error && error.message.startsWith("AI Oracle is not configured")) {
            throw error;
        }
        if (error instanceof Error) {
            const keySnippet = getApiKeySnippet();
            throw new Error(`The Oracle could not identify the stone. (Key used: ${keySnippet}) (Details: ${error.message})`);
        }
        throw new Error("Failed to identify the stone. The stars may be misaligned due to an unknown issue.");
    }
};