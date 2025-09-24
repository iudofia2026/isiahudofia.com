export default function Loading() {
  return (
    <main className="flex min-h-[50vh] items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-border border-t-accent" aria-label="Loading" />
    </main>
  );
}
