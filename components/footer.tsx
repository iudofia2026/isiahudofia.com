const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-border/40 bg-surface/60 px-6 py-8 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 text-sm text-foreground/70 md:flex-row md:items-center md:justify-between">
        <p>© {year} Isiah Udofia. Product-minded builder crafting thoughtful experiences.</p>
        <div className="flex flex-wrap items-center gap-4">
          <a className="hover:text-accent" href="tel:+19733036883">
            973-303-6883
          </a>
          <a className="hover:text-accent" href="https://github.com/iudofia2026" rel="noopener" target="_blank">
            GitHub
          </a>
          <a
            className="hover:text-accent"
            href="https://www.linkedin.com/in/REPLACE_WITH_YOUR_SLUG"
            rel="noopener"
            target="_blank"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
