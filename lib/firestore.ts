import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { GeneratedPlan } from "./mockPlanner";

export async function savePlan(
  plan: GeneratedPlan,
): Promise<{ success: boolean; id?: string; error?: Error }> {
  try {
    const docRef = await addDoc(collection(db, "plans"), {
      ...plan,
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
