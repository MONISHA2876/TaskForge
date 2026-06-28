import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  try {
    const {
      taskTitle,
      planHeading,
      userInput,
      conversation = [],
    } = await req.json();

    if (!taskTitle) {
      return NextResponse.json(
        { success: false, message: "Task title is required." },
        { status: 400 },
      );
    }

    const turns: ChatTurn[] = Array.isArray(conversation)
      ? conversation.filter(
          (turn: ChatTurn) =>
            turn &&
            typeof turn.role === "string" &&
            typeof turn.content === "string",
        )
      : [];

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const hasUserReply = turns.some((turn) => turn.role === "user");
    const shouldAskQuestions =
      turns.length === 0 || (!hasUserReply && !userInput);

    const prompt = `
You are Task Forge AI, a practical productivity coach.
Help the user make better progress on a single task.

Task title: ${taskTitle}
Plan heading: ${planHeading || "General plan"}

Conversation so far:
${
  turns.length > 0
    ? turns
        .map(
          (turn) =>
            `${turn.role === "user" ? "User" : "Assistant"}: ${turn.content}`,
        )
        .join("\n")
    : "No prior conversation."
}

User input: ${userInput || "No extra details provided."}

Rules:
- If this is the start of the chat, ask up to 3 concise clarifying questions that help you guide the user.
- If the user already answered and is now asking for help or clarifying, give a practical final response with a short summary, 3-5 actionable steps, and a mini research checklist.
- If the user asks something else in chat, reply helpfully and directly.
- Keep it concise but useful.
- Return valid JSON with this exact shape:
{
  "mode": "questions" | "answer",
  "message": "",
  "summary": "",
  "steps": [""],
  "researchChecklist": [""]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const json = JSON.parse(cleaned);

    return NextResponse.json({
      success: true,
      mode: json.mode || (shouldAskQuestions ? "questions" : "answer"),
      message:
        json.message ||
        (shouldAskQuestions
          ? "Here are a few questions to narrow this down."
          : "Here is a practical next step to get moving."),
      summary: json.summary || "",
      steps: Array.isArray(json.steps) ? json.steps : [],
      researchChecklist: Array.isArray(json.researchChecklist)
        ? json.researchChecklist
        : [],
      questions: Array.isArray(json.questions) ? json.questions : [],
    });
  } catch (error) {
    console.error("Plan help AI error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate AI assistance.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
