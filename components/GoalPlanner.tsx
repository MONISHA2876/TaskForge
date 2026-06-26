"use client";

import { useState } from "react";

export default function GoalPlanner() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  async function generatePlan() {
    setLoading(true);

    const res = await fetch("/api/plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    const data = await res.json();

    setPlan(data);

    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <textarea
        rows={7}
        className="w-full rounded-xl border p-5"
        placeholder="What do you want to achieve?"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={generatePlan}
        className="rounded-xl bg-black px-6 py-3 text-white"
      >
        {loading ? "Generating..." : "Generate AI Plan"}
      </button>

      {plan && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{plan.title}</h2>

          {plan.tasks.map((task: any, index: number) => (
            <div key={index} className="rounded-xl border p-5">
              <h3>{task.title}</h3>

              <p>{task.description}</p>

              <p>{task.priority}</p>

              <p>{task.dueDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
