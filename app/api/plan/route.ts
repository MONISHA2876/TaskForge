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

The user will describe goals for a day, week, or month.

Your responsibility is to convert those goals into a realistic execution plan.

Rules:

- Break large goals into smaller actionable tasks.
- Group tasks by day.
- Every day must contain:
  - day
  - date (YYYY-MM-DD)
  - items
- Arrange tasks chronologically.
- Never overlap tasks.
- Estimate realistic durations.
- Assign priorities (High, Medium, Low).
- Decide the best period:
  Morning
  Afternoon
  Evening
  Night
- Generate a short motivational AI note for every task.
- Keep the schedule realistic.
- Balance the workload across multiple days.
- If the user asks for a weekly plan, generate all 7 days.
- If the user asks for a daily plan, generate only one day.
- If the user asks for a monthly plan, distribute tasks intelligently.
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT use \`\`\`.
- Do NOT explain anything.

Return exactly this schema:

{
  "heading": "",
  "summary": "",
  "planType": "Daily | Weekly | Monthly",
  "productivityScore": 0,
  "focusTime": "",
  "breakTime": "",
  "completionEstimate": "",
  "totalTasks": 0,

  "days": [
    {
      "day": "",
      "date": "",

      "items": [
        {
          "id": "",
          "title": "",
          "taskType": "",
          "priority": "High | Medium | Low",
          "period": "Morning | Afternoon | Evening | Night",
          "time": "",
          "duration": "",
          "completed": false,
          "aiNote": ""
        }
      ]
    }
  ]
}

Allowed taskType values:

study
revision
practice
assignment
project
coding
meeting
exercise
reading
research
writing
break
personal
errands
shopping
travel
health
work
other

User Goal:

${prompt}
`);

    const text = result.response.text();

    console.log("Gemini Response:\n", text);

    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const json = JSON.parse(cleaned);

    return NextResponse.json(json);
  } catch (error) {
    console.error("Planner API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate AI plan.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
