import { redirect } from "next/navigation";

export default async function LegacyPlanPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;
  redirect(`/plans/${planId}`);
}
