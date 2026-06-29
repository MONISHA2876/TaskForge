import { db } from "./firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { GeneratedPlan } from "./mockPlanner";
import type { Plan, PlanDay, Task } from "@/types";

function normalizePlan(plan: Record<string, unknown>): Plan {
  const rawDays = Array.isArray(plan.days)
    ? (plan.days as Array<Record<string, unknown>>)
    : [];
  const days: PlanDay[] = rawDays.map((day) => ({
    day: typeof day.day === "string" ? day.day : "",
    date: typeof day.date === "string" ? day.date : "",
    items: Array.isArray(day.items) ? (day.items as Task[]) : [],
  }));

  const totalTasks = days.reduce((sum, day) => sum + day.items.length, 0);

  return {
    id: typeof plan.id === "string" ? plan.id : "",
    heading: typeof plan.heading === "string" ? plan.heading : "Untitled plan",
    summary:
      typeof plan.summary === "string"
        ? plan.summary
        : "Saved from your planner",
    planType:
      plan.planType === "Daily" ||
      plan.planType === "Weekly" ||
      plan.planType === "Monthly"
        ? plan.planType
        : "Weekly",
    productivityScore: Number(plan.productivityScore || 0),
    focusTime: typeof plan.focusTime === "string" ? plan.focusTime : "0h",
    breakTime: typeof plan.breakTime === "string" ? plan.breakTime : "0m",
    completionEstimate:
      typeof plan.completionEstimate === "string"
        ? plan.completionEstimate
        : "Pending",
    totalTasks: Number(plan.totalTasks || totalTasks),
    days,
  };
}

export async function savePlan(
  plan: GeneratedPlan,
  userId?: string | null,
): Promise<{ success: boolean; id?: string; error?: Error }> {
  try {
    if (!userId) {
      return { success: false, error: new Error("User must be signed in") };
    }

    const docRef = await addDoc(collection(db, "plans"), {
      ...plan,
      userId,
      status: "draft",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("Plan Saved:", docRef.id);

    return {
      success: true,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error saving plan:", error);

    return {
      success: false,
      error: error as Error,
    };
  }
}

export async function updateTaskCompletion(
  plan: Plan,
  taskId: string,
  completed: boolean,
): Promise<boolean> {
  try {
    const updatedDays = plan.days.map((day) => ({
      ...day,
      items: day.items.map((task) =>
        task.id === taskId ? { ...task, completed } : task,
      ),
    }));

    await updateDoc(doc(db, "plans", plan.id), {
      days: updatedDays,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error updating task completion:", error);
    return false;
  }
}

export async function fetchPlans(userId?: string | null): Promise<Plan[]> {
  try {
    if (!userId) {
      return [];
    }

    const plansRef = collection(db, "plans");
    const q = query(
      plansRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((doc) =>
      normalizePlan({ id: doc.id, ...doc.data() }),
    );
  } catch (error) {
    console.error("Error fetching plans:", error);
    return [];
  }
}
