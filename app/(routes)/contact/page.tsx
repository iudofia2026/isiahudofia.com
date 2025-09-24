import RouteSeo from '../../../components/route-seo';
import Section from '../../../components/section';

export default function ContactPage() {
  return (
    <>
      <RouteSeo
        title="Contact"
        description="Reach Isiah Udofia for product collaborations, coffee chats, or speaking invites."
      />
      <Section eyebrow="Contact" title="Let&apos;s plan the next build.">
        <p className="text-lg text-foreground/75">
          I&apos;m actively exploring APM/RPM roles and consulting engagements where thoughtful product discovery and crisp
          execution unlock growth. Drop a note—cold outreach encouraged.
        </p>
        <div className="grid gap-10 lg:grid-cols-[1.3fr,1fr]">
          <form className="space-y-5 rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-subtle backdrop-blur">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Ada Lovelace"
                className="mt-2 w-full rounded-xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                className="mt-2 w-full rounded-xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-medium text-foreground">
                What should we explore?
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Share your product problem, timeline, or a link we should jam on."
                className="mt-2 w-full rounded-xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Send message (stub)
            </button>
            <p className="text-xs text-foreground/60">
              This form is a stub for now—hook up the API route or CRM of your choice.
            </p>
          </form>
          <div className="space-y-4 text-sm text-foreground/75">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-accent/80">Direct line</p>
              <a href="tel:+19733036883" className="mt-2 inline-block text-lg font-semibold text-foreground hover:text-accent">
                973-303-6883
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-accent/80">Email</p>
              <a href="mailto:isiah@udofia.co" className="mt-2 inline-block text-lg font-semibold hover:text-accent">
                isiah@udofia.co
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-accent/80">Links</p>
              <ul className="mt-2 space-y-1">
                <li>
                  <a
                    className="underline decoration-border/60 underline-offset-4 transition hover:text-accent"
                    href="https://github.com/iudofia2026"
                    target="_blank"
                    rel="noopener"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    className="underline decoration-border/60 underline-offset-4 transition hover:text-accent"
                    href="https://www.linkedin.com/in/REPLACE_WITH_YOUR_SLUG"
                    target="_blank"
                    rel="noopener"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
