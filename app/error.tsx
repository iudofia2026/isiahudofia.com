'use client';

export default function ErrorState({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Something went sideways.</h1>
      <p className="max-w-md text-sm text-foreground/70">
        {error?.message || 'An unexpected error occurred. Try refreshing or head back to the previous route.'}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90"
      >
        Retry
      </button>
    </main>
  );
}
