import RouteSeo from '../../../components/route-seo';
import Section from '../../../components/section';

const lines = [
  'Senior B.S. in Cognitive Science at Yale',
  'I’m interested in product management and how technical ideas become usable products. Alongside my coursework, I’ve been “vibe coding” projects like a live Discord voice translator, building skills in design, front-end development, and AI integration.',
  'Outside of coding, I run a video editing agency that works with creators and brands, managing editors and helping clients grow through stronger storytelling.',
  'For my senior thesis, I’m analyzing wearable sleep data with machine learning, linking physiology to subjective experience. I see it as a way to connect the product-building mindset I’ve developed in my side projects and agency work with academic research that impacts real people.',
];

const avatarSrc = 'https://media.licdn.com/dms/image/D4E03AQFj-kQHgYku0A/profile-displayphoto-shrink_400_400/0/1700000000000?e=2147483647&v=beta&t=placeholder';

const interests = ['AI + ML', 'Product Building', 'Startups', 'Video Editing', 'Sleep Research'];

export default function AboutPage() {
  return (
    <>
      <RouteSeo title="About" />
      <Section eyebrow="Profile" title="Isiah Udofia">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="mx-auto flex w-32 flex-none justify-center lg:mx-0">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border border-border/60 shadow-[0_0_45px_-12px_rgba(14,165,233,0.35)]">
              <img
                src={avatarSrc}
                alt="Isiah Udofia"
                className="h-full w-full object-cover"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }}
              />
            </div>
          </div>
          <div className="space-y-3 text-lg text-foreground/70">
            {lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          {interests.map((label) => (
            <span
              key={label}
              className="rounded-full border border-border/60 bg-background/80 px-4 py-2 text-foreground/70 shadow-[0_0_30px_-18px_rgba(255,255,255,0.4)]"
            >
              {label}
            </span>
          ))}
        </div>
      </Section>
    </>
  );
}
