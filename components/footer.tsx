const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border/40 bg-surface/60 px-6 py-8 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 text-sm text-foreground/60">
        <p>© {year} Isiah Udofia</p>
        <div className="flex flex-wrap items-center gap-3">
          <a className="hover:text-accent" href="mailto:isiah.udofia@yale.edu">
            isiah.udofia@yale.edu
          </a>
          <span aria-hidden="true">|</span>
          <a className="hover:text-accent" href="tel:+19733036883">
            973-303-6883
          </a>
          <span aria-hidden="true">|</span>
          <a className="hover:text-accent" href="https://github.com/iudofia2026" rel="noopener" target="_blank">
            GitHub
          </a>
          <span aria-hidden="true">|</span>
          <a
            className="hover:text-accent"
            href="https://www.linkedin.com/in/isiah-udofia/"
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
