import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="text-sm uppercase tracking-[0.32em] text-accent/80">404</p>
      <h1 className="text-3xl font-semibold text-foreground">That page drifted off the roadmap.</h1>
      <p className="max-w-xl text-base text-foreground/70">
        The route you&apos;re looking for might be in a private doc. Let&apos;s get you back to the work that&apos;s launched.
      </p>
      <Link
        href="/"
        className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90"
      >
        Return home
      </Link>
    </main>
  );
}
