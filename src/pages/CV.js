import React from 'react';
import { socialLinks } from '../data/siteContent';
import './CV.css';

const experience = [
  {
    organization: 'Circle Health',
    location: 'Berlin, Germany',
    role: 'Full-Stack Web Developer',
    start: 'May 2025',
    dateTime: '2025-05',
    current: true,
    contributions: [
      'Build and maintain React, Node.js, and PostgreSQL features for an AI-enabled SaaS practice management platform.',
      'Turn user needs and operational pain points into fixes and product improvements in a small forward-deployed team.',
      'Triage, debug, and resolve bugs across frontend, backend, and database workflows while supporting rapid product iteration.',
    ],
  },
  {
    organization: 'Thula Solutions',
    role: 'Engineering Intern',
    start: '2023',
    dateTime: '2023',
    contributions: ['Applied analytical problem-solving in a practical engineering setting.'],
  },
  {
    organization: 'Yoco (formerly Dado)',
    location: 'Cape Town, South Africa',
    role: 'Software Intern',
    start: '2021',
    dateTime: '2021',
    contributions: ['Supported software development, testing, and collaborative delivery.'],
  },
];

const education = [
  {
    organization: 'MCI Innsbruck',
    location: 'Innsbruck, Austria',
    program: 'Digital Business and Software Engineering',
    start: '2025',
    current: true,
  },
  {
    organization: 'University of Cape Town',
    location: 'Cape Town, South Africa',
    program: 'BScEng Mechatronics coursework',
    start: '2020',
  },
];

const skills = [
  ['Frontend', 'React, TypeScript, JavaScript'],
  ['Backend and data', 'Node.js, PostgreSQL, SQL, JSON'],
  ['Additional languages', 'Python, C'],
  ['Delivery', 'Feature development, bug fixing, debugging, QA'],
  ['Collaboration', 'Forward-deployed teamwork, user-facing implementation'],
];

function EntryHeading({ organization, location, start, dateTime = start, current }) {
  return (
    <header className="cv-entry-heading">
      <div>
        <h3>{organization}</h3>
        {location && <p className="cv-location">{location}</p>}
      </div>
      <p className="cv-period">
        <time dateTime={dateTime}>{start}</time>{current && ' – Present'}
      </p>
    </header>
  );
}

export default function CV() {
  return (
    <div className="cv-page">
      <article className="cv-document" aria-labelledby="cv-name">
        <header className="cv-intro">
          <h1 id="cv-name">Julian Dower</h1>
          <p className="cv-role">Full-Stack Web Developer</p>
          <p className="cv-summary">
            I build AI-enabled SaaS for healthcare practice management with React, Node.js, and PostgreSQL.
            My work spans feature delivery, debugging, and direct collaboration with product teams and users.
            I’m open to on-site or hybrid roles in Germany and Austria and willing to relocate.
          </p>
          <a className="cv-email" href={socialLinks.email}>{socialLinks.email.slice('mailto:'.length)}</a>
        </header>

        <section className="cv-section" aria-labelledby="cv-experience">
          <h2 id="cv-experience">Experience</h2>
          <div className="cv-entries">
            {experience.map(({ role, contributions, ...heading }) => (
              <div key={heading.organization}>
                <EntryHeading {...heading} />
                <p className="cv-entry-role">{role}</p>
                <ul className="cv-contributions">
                  {contributions.map(contribution => <li key={contribution}>{contribution}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="cv-section" aria-labelledby="cv-skills">
          <h2 id="cv-skills">Core skills</h2>
          <dl className="cv-skills">
            {skills.map(([label, description]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{description}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="cv-section" aria-labelledby="cv-education">
          <h2 id="cv-education">Education</h2>
          <div className="cv-entries">
            {education.map(({ program, ...heading }) => (
              <div key={heading.organization}>
                <EntryHeading {...heading} />
                <p className="cv-entry-role">{program}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cv-section" aria-labelledby="cv-languages">
          <h2 id="cv-languages">Languages and certifications</h2>
          <ul className="cv-languages">
            <li>English · Native</li>
            <li>German · B2</li>
            <li>Goethe-Zertifikat B2 German Language Certificate, <time dateTime="2023">2023</time></li>
          </ul>
        </section>
      </article>
    </div>
  );
}
