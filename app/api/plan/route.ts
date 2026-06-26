import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(`
You are Deadline Guardian AI, an intelligent productivity coach.

Convert the user's goals into an optimized execution plan.

Rules:

- Break large goals into smaller actionable tasks.
- Arrange tasks logically.
- Estimate realistic durations.
- Assign priorities (High, Medium, Low).
- Decide the best period:
  Morning, Afternoon, Evening, Night.
- Generate one motivational AI note per task.
- Never create overlapping tasks.
- Keep the schedule realistic.
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT use \`\`\`json.
- Output ONLY the JSON object.

Schema:

{
  "heading": "",
  "summary": "",
  "productivityScore": 0,
  "focusTime": "",
  "breakTime": "",
  "completionEstimate": "",
  "totalTasks": 0,

  "items": [
    {
      "id": "",
      "title": "",
      "taskType": "",
      "priority": "",
      "period": "",
      "time": "",
      "duration": "",
      "completed": false,
      "aiNote": ""
    }
  ]
}

User Goal:

${prompt}
`);

    const text = result.response.text();

    console.log("Gemini Response:\n", text);

    // Remove markdown if Gemini still returns it
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const json = JSON.parse(cleaned);

    return NextResponse.json(json);
  } catch (error: unknown) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      {
        status: 500,
      },
    );
  }
}
