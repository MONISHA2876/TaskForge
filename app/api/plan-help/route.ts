import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  taskTitle: string;
  taskType: string;
  priority: string;
  duration: string;
  period: string;
  aiNote: string;
  planHeading: string;
  planSummary: string;
  userInput: string;
  conversation: ChatMessage[];
}

function buildPrompt(body: RequestBody): string {
  const isFirstMessage = !body.userInput && body.conversation.length === 0;
  const history = body.conversation
    .map(
      (msg) =>
        `${msg.role === "assistant" ? "Assistant" : "User"}: ${msg.content}`,
    )
    .join("\n");

  const userPrompt = isFirstMessage
    ? `Hi, I need help with this task: "${body.taskTitle}". Please start by asking me the key questions you need answered before you can help.`
    : body.userInput;

  return `You are an expert AI productivity coach inside TaskForge.

PLAN CONTEXT:
- Plan: "${body.planHeading}"
- Plan Summary: "${body.planSummary}"

CURRENT TASK:
- Title: "${body.taskTitle}"
- Type: ${body.taskType}
- Priority: ${body.priority}
- Duration: ${body.duration}
- Period: ${body.period}
${body.aiNote ? `- AI Note: "${body.aiNote}"` : ""}

CONVERSATION HISTORY:
${history || "No previous messages."}

YOUR BEHAVIOUR:
1. On the first message, introduce yourself briefly and ask 2-3 focused questions to understand what the user needs before giving advice.
2. Once the user answers, give concrete, actionable help with steps, resources, frameworks, or examples.
3. If you still need more info, ask one short follow-up question.
4. Keep responses clear, structured, and encouraging. Use short paragraphs. Avoid walls of text.
5. Never repeat the task title in every message.

Always respond in plain text. No markdown headers. Use simple numbered lists or dashes only when listing steps.

User message:
${userPrompt}`;
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          message:
            "Gemini API key not configured. Add GEMINI_API_KEY to your .env.local file.",
        },
        { status: 500 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(buildPrompt(body));
    const text = result.response.text();

    return NextResponse.json({ message: text });
  } catch (err) {
    console.error("plan-help route error:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
