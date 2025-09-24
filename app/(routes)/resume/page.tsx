import RouteSeo from '../../../components/route-seo';
import Section from '../../../components/section';

const resumePath = '/Isiah_Udofia_Resume.pdf';

export default function ResumePage() {
  return (
    <>
      <RouteSeo title="Resume" />
      <Section eyebrow="Resume" title="Snapshot">
        <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70">
          <a
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition duration-300 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href={resumePath}
            target="_blank"
            rel="noopener"
          >
            Download PDF
          </a>
          <span>Replace the placeholder file when ready.</span>
        </div>
        <div className="mt-6 overflow-hidden rounded-[2rem] border border-border/40 bg-surface/80 shadow-subtle">
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
