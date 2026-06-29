import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  imageBase64?: string;
}

interface RequestBody {
  conversation: ChatMessage[];
  userInput: string;
  imageBase64?: string;
  imageMimeType?: string;
}

const SYSTEM_PROMPT = `You are an expert AI productivity planner inside TaskForge. Your job is to help the user build a detailed, personalized productivity plan through friendly conversation.

CONVERSATION FLOW:
1. When the user first describes their goal, ask 2-3 focused clarifying questions to understand:
   - Their available time slots / schedule constraints
   - Their current skill level or context (if relevant)
   - Any priorities or deadlines
   - Their preferred work style (deep focus vs short sprints)

2. As the user answers, acknowledge their responses naturally and ask follow-up questions if needed.

3. Once you have enough context (usually after 2-4 exchanges), tell the user you have enough information and ask them to click "Generate Plan" to create their detailed plan.

4. If the user uploads an image (timetable, notes, whiteboard), analyze it and extract useful scheduling information. Mention what you found.

5. Keep responses conversational, warm, and concise — max 3-4 short paragraphs. No walls of text.

6. Never generate the actual plan yourself in chat. Only gather information and confirm when ready.

TONE: Friendly, encouraging, like a smart productivity coach.`;

function buildPrompt(body: RequestBody): string {
  const history = body.conversation
    .map((msg) => {
      const prefix = msg.role === "assistant" ? "Assistant" : "User";
      const content =
        msg.content || (msg.imageBase64 ? "[image attachment]" : "");
      return `${prefix}: ${content}`;
    })
    .join("\n");

  return [
    `System instruction: ${SYSTEM_PROMPT}`,
    "",
    "Conversation history:",
    history || "No previous messages.",
    "",
    "Latest user message:",
    body.userInput || (body.imageBase64 ? "[image attachment]" : ""),
  ].join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { message: "Add GEMINI_API_KEY to your .env.local file." },
        { status: 500 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = buildPrompt(body);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({
      message:
        text.trim() || "I couldn't generate a response. Please try again.",
    });
  } catch (err) {
    console.error("planner-chat error:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
