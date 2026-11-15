import { useAuth } from "@/lib/auth-context";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning, ";
  if (hour < 17) return "Good afternoon, ";
  return "Good evening, ";
}

export function Greeting() {
  const { user } = useAuth();
  const displayName = user?.email?.split("@")[0] ?? "User";
  const greeting = getGreeting();

  return greeting+displayName;
}
