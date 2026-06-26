import Link from "next/link";

export default function Home() {
  return (
    <Link href="/planner" className="text-blue-500 underline">
      Go to Planner
    </Link>
  );
}
