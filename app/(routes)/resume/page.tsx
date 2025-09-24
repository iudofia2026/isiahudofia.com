'use client';

import RouteSeo from '../../../components/route-seo';

type Experience = {
  organization: string;
  role: string;
  location: string;
  timeframe: string;
  bullets: string[];
};

const education = {
  institution: 'Yale University, New Haven, CT',
  degree: 'Cognitive Science, B.S. – Neurocognitive Computation',
  coursework:
    'Relevant Coursework: Agile Framework, Web Design, AI Architecture, Neuroanatomy, Clinical Psychology',
  gpa:
    'GPA: 3.7 | Awards: MRCC Caddie Scholarship, All-Ivy Team (Long Jump), USTFCCCA Academic All-American',
  graduation: 'Expected May 2026',
};

const workExperiences: Experience[] = [
  {
    organization: 'Zen Video Agency',
    role: 'Founder',
    location: 'New Haven, CT',
    timeframe: 'July 2025 - Present',
    bullets: [
      'Founded and scaled a video editing agency with five retainer clients, delivering tailored solutions for athletes, musicians, and brands across YouTube, Instagram and TikTok',
      'Implemented workflows to improve editing turnaround and client satisfaction, while managing two video editors',
      'Leveraged data-driven insights and content strategy from growing personal TikTok to 20K+ followers in 8 weeks to advise clients on audience growth and engagement, helping one client grow from 4K to 36K followers in two months',
    ],
  },
  {
    organization: 'UBS',
    role: 'Summer Investment Banking Analyst',
    location: 'New York, NY',
    timeframe: 'June 2025 - August 2025',
    bullets: [
      'Trained in Debt Capital Markets team, assisting in origination and syndication of debt for investment grade firms',
      'Led an independent research initiative to educate team on structure and market dynamics of synthetic risk transfers',
    ],
  },
  {
    organization: 'Bain and Co.',
    role: 'Building Entrepreneurial Leaders Internship',
    location: 'New York, NY',
    timeframe: 'May 2023 - May 2024',
    bullets: [
      'Gained real-time exposure to the processes that Bain uses, included opportunity to meet and speak to consultants',
    ],
  },
  {
    organization: 'Blinds To Go Inc.',
    role: 'Supply Chain Intern',
    location: 'Lakewood, NJ',
    timeframe: 'June 2022 - August 2022',
    bullets: [
      'Worked directly with Plant Controller to audit, proposed change to bill of materials to align to actual production',
      'Bill of materials accuracy improved from 95% to 99+% and changes were used to open new plant in Saltillo, Mexico',
    ],
  },
  {
    organization: 'Mountain Ridge Country Club',
    role: 'Caddie',
    location: 'West Caldwell, New Jersey',
    timeframe: 'May 2022 - Present (Seasonal)',
    bullets: [
      'Hired by 200+ different club members and accompanying guests over the course of four seasons',
      'Selected to train two new caddies on club procedure and essential job skills, mentoring newcomers into full-time roles',
    ],
  },
  {
    organization: 'Independent Private Math Tutor',
    role: 'Founder',
    location: 'Montclair, NJ',
    timeframe: 'June 2019 - August 2023',
    bullets: [
      'Established private tutoring business and worked with 10+ students ranging from 4th to 12th grade, helping multiple students to place into advanced math programs and improve performance on standardized tests',
    ],
  },
];

const extracurriculars: Experience[] = [
  {
    organization: 'Yale Varsity Track and Field Team',
    role: 'Sprinter/Jumper',
    location: 'New Haven, CT',
    timeframe: 'August 2022 – June 2025',
    bullets: [
      'One of the select members responsible for recording, analyzing, and recommending improvements to jump team',
      'Organize multi-week lifting program geared towards summer strength improvement for short sprinters and jumpers',
      'Practice six times per week including commute to facilities off campus, lift twice per week',
      'Compete against internationally ranked athletes weekly in inter-Ivy league competitions from January to May',
      '3rd ranked all-time in Yale men’s long jump list, Finished back-to-back years top 50 in NCAA Division I in long jump',
    ],
  },
  {
    organization: 'Yale Afro American Cultural Center',
    role: 'Member',
    location: 'New Haven, CT',
    timeframe: 'August 2022 - Present',
    bullets: [
      'Participate in events with Yale’s Black student athletes to discuss school life, current events, and other relevant topics',
    ],
  },
];

export default function ResumePage() {
  return (
    <>
      <RouteSeo title="Resume" />
      <a
        href="#resume-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
      >
        Skip to content
      </a>
      <main
        id="resume-content"
        className="mx-auto my-10 w-full max-w-4xl font-serif text-[15px] leading-[1.65] text-black print:my-0 print:w-[8.27in] print:max-w-none print:bg-white"
      >
        <article className="rounded-3xl border border-border/40 bg-white p-8 shadow-2xl print:border-0 print:p-0 print:shadow-none print:bg-white">
          <header className="border-b border-black/40 pb-6 print:border-black/80">
            <h1 className="text-3xl font-extrabold tracking-[0.04em] text-black">ISIAH UDOFIA</h1>
            <address className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-black/80 not-italic">
              <span>New Haven, Connecticut</span>
              <span aria-hidden="true">|</span>
              <a href="tel:+19733036883" className="hover:underline">
                (973) 303-6883
              </a>
              <span aria-hidden="true">|</span>
              <a href="mailto:isiah.udofia@yale.edu" className="hover:underline">
                isiah.udofia@yale.edu
              </a>
              <span aria-hidden="true">|</span>
              <a href="https://www.linkedin.com/in/isiah-udofia/" className="hover:underline" target="_blank" rel="noopener">
                https://www.linkedin.com/in/isiah-udofia/
              </a>
            </address>
            <div className="mt-6 flex flex-wrap gap-3 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-md border border-black/30 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
              >
                Download PDF
              </button>
              <a
                href="mailto:isiah.udofia@yale.edu"
                className="rounded-md border border-black/30 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
              >
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/isiah-udofia/"
                target="_blank"
                rel="noopener"
                className="rounded-md border border-black/30 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/iudofia2026"
                target="_blank"
                rel="noopener"
                className="rounded-md border border-black/30 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
              >
                GitHub
              </a>
            </div>
          </header>

          <div className="mt-8 space-y-10 lg:grid lg:grid-cols-12 lg:gap-8 lg:space-y-0 print:grid print:grid-cols-1 print:gap-0">
            <div className="space-y-10 lg:col-span-7 print:col-span-1">
              <ResumeSection title="EDUCATION">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-[15px] font-semibold uppercase tracking-[0.02em] text-black">
                    {education.institution}
                  </h3>
                  <p className="text-[15px] font-semibold text-black">{education.graduation}</p>
                </div>
                <p className="mt-2 text-[15px] italic text-black">{education.degree}</p>
                <p className="mt-1 text-[15px] text-black/80">{education.coursework}</p>
                <p className="mt-1 text-[15px] text-black/80">{education.gpa}</p>
              </ResumeSection>

              <ResumeSection title="WORK EXPERIENCE">
                {workExperiences.map((experience) => (
                  <ResumeEntry key={`${experience.organization}-${experience.timeframe}`} experience={experience} />
                ))}
              </ResumeSection>
            </div>

            <div className="mt-10 space-y-10 lg:col-span-5 lg:mt-0 print:col-span-1">
              <ResumeSection title="EXTRACURRICULAR ACTIVITIES (LEADERSHIP EXPERIENCE)">
                {extracurriculars.map((experience) => (
                  <ResumeEntry key={`${experience.organization}-${experience.timeframe}`} experience={experience} />
                ))}
              </ResumeSection>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid border-t border-black/30 pt-4 print:border-black/80">
      <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-black">{title}</h2>
      <div className="mt-4 space-y-6 text-[15px] text-black/85">{children}</div>
    </section>
  );
}

function ResumeEntry({ experience }: { experience: Experience }) {
  return (
    <article className="break-inside-avoid">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-[15px] font-semibold text-black">
          {experience.organization}, <span className="font-normal italic">{experience.role}</span>, {experience.location}
        </h3>
        <p className="text-[15px] font-semibold text-black">{experience.timeframe}</p>
      </div>
      <ul className="mt-2 space-y-2 pl-5 text-[15px] text-black/80 md:pl-6 list-disc">
        {experience.bullets.map((bullet) => (
          <li key={bullet} className="leading-relaxed marker:text-black">
            {bullet}
          </li>
        ))}
      </ul>
    </article>
  );
}
