import RouteSeo from '../../../components/route-seo';
import Section from '../../../components/section';

const resumePath = '/Isiah_Udofia_Resume.pdf';

export default function ResumePage() {
  return (
    <>
      <RouteSeo
        title="Resume"
        description="Download or view Isiah Udofia's resume, highlighting product experience across AI, research, and creative ops."
      />
      <Section eyebrow="Resume" title="Snapshot of product, research, and operating experience.">
        <div className="space-y-4 text-sm text-foreground/70">
          <a
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href={resumePath}
            target="_blank"
            rel="noopener"
          >
            Download PDF
          </a>
          <p>
            The embedded viewer below pulls from the `/public` placeholder. Swap in your actual PDF when you&apos;re ready.
          </p>
        </div>
        <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-surface/80 shadow-subtle">
          <iframe
            src={`${resumePath}#toolbar=0&navpanes=0`}
            title="Isiah Udofia resume"
            className="h-[80vh] w-full"
          />
        </div>
      </Section>
    </>
  );
}
