import Section from '../../../components/section';
import ProjectCard from '../../../components/project-card';
import RouteSeo from '../../../components/route-seo';
import { projects } from '../../../data/projects';

export default function ProjectsPage() {
  return (
    <>
      <RouteSeo
        title="Projects"
        description="Case studies covering Discorder, Zen Video Agency, and a thesis on predicting adolescent sleep risk."
      />
      <Section eyebrow="Portfolio" title="Full project breakdowns.">
        <p className="text-sm text-foreground/70">
          Each project unpacks the problem statement, the approach I owned, and the measurable results. Dive in for
          PM artifacts, product decisions, and next steps.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>
    </>
  );
}
