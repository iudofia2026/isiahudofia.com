import Link from 'next/link';
import Script from 'next/script';
import RouteSeo from '../components/route-seo';
import Section from '../components/section';
import ProjectCard from '../components/project-card';
import HeroBg from '../components/hero-bg';
import { projects } from '../data/projects';

const featured = projects.slice(0, 3);

export default function HomePage() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Isiah Udofia',
    jobTitle: 'Product Builder',
    telephone: '+1-973-303-6883',
    email: 'isiah.udofia@yale.edu',
    url: 'https://www.isiahudofia.com',
    sameAs: [
      'https://github.com/iudofia2026',
      'https://www.linkedin.com/in/isiah-udofia/',
    ],
  };

  return (
    <>
      <RouteSeo title="Isiah Udofia" />
      <Script id="person-schema" type="application/ld+json">
        {JSON.stringify(personSchema)}
      </Script>
      <div className="mx-auto w-full max-w-6xl px-2 pt-4 sm:px-4">
        <div
          className="relative isolate overflow-hidden rounded-[3rem] border border-border/40 bg-[#050505] px-8 py-28 text-center shadow-subtle sm:px-16"
          style={{
            backgroundImage:
              'radial-gradient(circle at top, rgba(56,189,248,0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(99,102,241,0.22), transparent 60%), url(/noise.svg)',
          }}
        >
          <HeroBg intensity={0.8} />
          <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
            <div className="pointer-events-none absolute -inset-40 bg-gradient-to-br from-cyan-400/25 via-purple-500/20 to-indigo-500/25 blur-[120px] motion-safe:animate-[gradientShift_28s_ease-in-out_infinite] motion-reduce:animate-none" />
          </div>
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-10">
            <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-7xl md:text-8xl">
              Isiah Udofia
            </h1>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/projects"
                className="rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background transition duration-300 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
              >
                View Projects
              </Link>
              <Link
                href="mailto:isiah.udofia@yale.edu"
                className="rounded-full border border-border/60 px-8 py-3 text-sm font-semibold text-foreground transition duration-300 hover:border-accent/70 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
              >
                Email Me
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Section eyebrow="Featured Work" title="Projects">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>
    </>
  );
}
