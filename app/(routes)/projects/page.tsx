import RouteSeo from '../../../components/route-seo';
import Section from '../../../components/section';
import ProjectCard from '../../../components/project-card';
import { projects } from '../../../data/projects';

export default function ProjectsPage() {
  return (
    <>
      <RouteSeo title="Projects" />
      <Section eyebrow="Index" title="Selected builds">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>
    </>
  );
}
