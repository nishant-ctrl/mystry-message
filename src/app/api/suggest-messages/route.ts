import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function POST(req: Request) {
    const prompt = `Create a list of three open-ended and thought-provoking tech-related questions formatted as a single string. Each question should be separated by ||. These questions are designed for an anonymous social messaging platform (like Qooh.me) and must be inclusive, friendly, and spark curiosity across a wide audience.Avoid personal, sensitive, or overly technical jargon. Focus on themes like emerging technology, future possibilities, digital habits, or tech-inspired imagination. The goal is to foster creative and meaningful interactions that anyone can relate to — from casual users to tech enthusiasts.Format your output exactly like this:
'If you could invent any tech gadget, what would it do?||What’s a piece of technology you couldn’t live without—and why?||Which futuristic innovation are you most excited to see in real life?'`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            thinkingConfig: {
                thinkingBudget: 0,
            },
        },
    });
    return Response.json({ messages: response.text });
}
