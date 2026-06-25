import AppShell from "@/components/AppShell";

export default function Home() {
  return (
    <AppShell>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <h1 className="text-4xl font-bold">Welcome to Task Forge</h1>
        <p className="text-lg text-muted-foreground">
          Your AI-powered task management companion.
        </p>
      </div>
    </AppShell>
  );
}
