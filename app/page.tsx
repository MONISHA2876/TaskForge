"use client";

import HomePage from "@/components/HomePage";
import HomepageNew from "@/components/HomepageNew";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <HomePage /> : <HomepageNew />;
}
