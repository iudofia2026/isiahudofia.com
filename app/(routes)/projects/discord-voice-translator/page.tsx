import Script from 'next/script';
import CaseStudyLayout from '../../../../components/case';
import Section from '../../../../components/section';
import RouteSeo from '../../../../components/route-seo';
import { projects } from '../../../../data/projects';

const project = projects.find((item) => item.slug === 'discord-voice-translator');

if (!project) {
  throw new Error('Discorder project data missing');
}

export default function DiscorderCaseStudy() {
  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'Project',
    name: project.title,
    description: project.tagline,
    url: `https://www.isiahudofia.com/projects/${project.slug}`,
    creator: {
      '@type': 'Person',
      name: 'Isiah Udofia',
    },
    keywords: project.stack,
    additionalProperty: project.metrics?.map((metric) => ({
      '@type': 'PropertyValue',
      name: metric.label,
      value: metric.value,
    })),
  };

  return (
    <>
      <RouteSeo
        title="Discorder — Discord voice translator"
        description="How I shipped low-latency live translation inside Discord voice rooms to keep multilingual friend groups together."
      />
      <Script id="discorder-schema" type="application/ld+json">
        {JSON.stringify(projectSchema)}
      </Script>
      <Section
        eyebrow="Discorder"
        title="Keeping Discord squads together with sub-250ms live translation."
      >
        <p className="text-lg text-foreground/75">
          Discorder surfaces real-time captions and translations inside Discord voice channels so international friend
          groups can actually stay in one conversation. I owned the product definition, latency budget, and integration
          with Discord&apos;s stage interfaces.
        </p>
      </Section>
      <CaseStudyLayout project={project}>
        <CaseSection title="Problem">
          Discord makes it easy to talk, but cross-language squads were splitting into multiple servers or abandoning
          voice altogether. Existing bots only translated text channels and introduced 3–4 second lags.
        </CaseSection>
        <CaseSection title="Approach">
          <ul className="space-y-3">
            <li>
              Interviewed 12 multilingual Discord communities to map conversational flows and acceptable latency; set a
              300ms ceiling to preserve turn-taking.
            </li>
            <li>
              Prototyped a WebRTC capture layer that streams segmented audio into Whisper running on GPU instances with
              beam search tuned for conversational speech.
            </li>
            <li>
              Piped transcripts into DeepL for translation, applied speaker diarization, and surfaced captions via a
              custom stage-side overlay using Discord Activities.
            </li>
          </ul>
        </CaseSection>
        <CaseSection title="Result">
          <ul className="space-y-3">
            <li>
              Achieved <strong>237ms median latency</strong> in load tests with eight concurrent speakers while holding
              94% transcription accuracy.
            </li>
            <li>
              Pilot groups increased joint session time by 28% week-over-week because conversations stopped fracturing.
            </li>
            <li>
              Captions improved accessibility for neurodiverse users who preferred blended audio + text input.
            </li>
          </ul>
        </CaseSection>
        <CaseSection title="Next Steps">
          <ul className="space-y-3">
            <li>Ship opt-in logging to improve language model fine-tuning with community consent.</li>
            <li>Add plugin economics (usage-based pricing) and moderation guardrails for hate speech signatures.</li>
            <li>Explore spatial audio cues to differentiate simultaneous translators.</li>
          </ul>
        </CaseSection>
      </CaseStudyLayout>
    </>
  );
}

type CaseSectionProps = {
  title: string;
  children: React.ReactNode;
};

function CaseSection({ title, children }: CaseSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <div className="text-base leading-relaxed text-foreground/75">{children}</div>
    </section>
  );
}
