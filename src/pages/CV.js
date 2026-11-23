import React from 'react';
import { socialLinks } from '../data/siteContent';
import { useLocale } from '../locale';
import './CV.css';

const developerRole = { en: 'Full-Stack Web Developer', de: 'Full-Stack-Webentwickler' };
const capeTown = { en: 'Cape Town, South Africa', de: 'Kapstadt, Südafrika' };

const copy = {
  en: {
    summary: 'I build AI-enabled SaaS for healthcare practice management with React, Node.js, and PostgreSQL. My work spans feature delivery, debugging, and direct collaboration with product teams and users. I’m open to on-site or hybrid roles in Germany and Austria and willing to relocate.',
    experience: 'Experience',
    skills: 'Core skills',
    education: 'Education',
    languages: 'Languages and certifications',
    english: 'English · Native',
    german: 'German · B2',
    certificate: 'Goethe-Zertifikat B2 German Language Certificate',
    formerly: 'formerly',
    present: 'Present',
  },
  de: {
    summary: 'Ich entwickle KI-gestützte SaaS-Software zur Praxisverwaltung mit React, Node.js und PostgreSQL. Ich setze neue Funktionen um, behebe Fehler und arbeite direkt mit Produktteams und Anwendern zusammen. Ich bin offen für Stellen vor Ort oder im Hybridmodell in Deutschland und Österreich und bereit, dafür umzuziehen.',
    experience: 'Berufserfahrung',
    skills: 'Fachkenntnisse',
    education: 'Ausbildung',
    languages: 'Sprachen und Zertifikate',
    english: 'Englisch · Muttersprache',
    german: 'Deutsch · B2',
    certificate: 'Goethe-Zertifikat B2',
    formerly: 'früher',
    present: 'heute',
  },
};

const experience = [
  {
    organization: 'Circle Health',
    location: { en: 'Berlin, Germany', de: 'Berlin, Deutschland' },
    role: developerRole,
    start: '2025-05',
    current: true,
    contributions: {
      en: [
        'Build and maintain React, Node.js, and PostgreSQL features for an AI-enabled SaaS practice management platform.',
        'Turn user needs and operational pain points into fixes and product improvements in a small forward-deployed team.',
        'Triage, debug, and resolve bugs across frontend, backend, and database workflows while supporting rapid product iteration.',
      ],
      de: [
        'Entwickle und warte Funktionen für eine KI-gestützte SaaS-Plattform zur Praxisverwaltung mit React, Node.js und PostgreSQL.',
        'Setze in einem kleinen, nutzernahen Team Anforderungen und Probleme aus dem Praxisalltag in Fehlerkorrekturen und Produktverbesserungen um.',
        'Priorisiere, analysiere und behebe Fehler in Frontend, Backend und Datenbank und unterstütze kurze Entwicklungszyklen.',
      ],
    },
  },
  {
    organization: 'Thula Solutions',
    role: { en: 'Engineering Intern', de: 'Praktikum im Ingenieurwesen' },
    start: '2023',
    contributions: {
      en: ['Applied analytical problem-solving in a practical engineering setting.'],
      de: ['Setzte analytische Methoden ein, um praktische technische Probleme zu lösen.'],
    },
  },
  {
    organization: 'Yoco',
    formerName: 'Dado',
    location: capeTown,
    role: { en: 'Software Intern', de: 'Praktikum in der Softwareentwicklung' },
    start: '2021',
    contributions: {
      en: ['Supported software development, testing, and collaborative delivery.'],
      de: ['Unterstützte das Team bei der Entwicklung, beim Testen und bei der Auslieferung von Software.'],
    },
  },
];

const education = [
  {
    organization: 'MCI Innsbruck',
    location: { en: 'Innsbruck, Austria', de: 'Innsbruck, Österreich' },
    program: {
      en: 'Digital Business and Software Engineering',
      de: 'Digital Business and Software Engineering',
    },
    start: '2025',
    current: true,
  },
  {
    organization: 'University of Cape Town',
    location: capeTown,
    program: { en: 'BScEng Mechatronics coursework', de: 'Lehrveranstaltungen in Mechatronik (BScEng)' },
    start: '2020',
  },
];

const skills = [
  { en: ['Frontend', 'React, TypeScript, JavaScript'], de: ['Frontend', 'React, TypeScript, JavaScript'] },
  { en: ['Backend and data', 'Node.js, PostgreSQL, SQL, JSON'], de: ['Backend und Daten', 'Node.js, PostgreSQL, SQL, JSON'] },
  { en: ['Additional languages', 'Python, C'], de: ['Weitere Programmiersprachen', 'Python, C'] },
  {
    en: ['Delivery', 'Feature development, bug fixing, debugging, QA'],
    de: ['Entwicklung', 'Neue Funktionen, Fehlerbehebung, Debugging, Qualitätssicherung'],
  },
  {
    en: ['Collaboration', 'Forward-deployed teamwork, user-facing implementation'],
    de: ['Zusammenarbeit', 'Nutzernahe Umsetzung im Team'],
  },
];

function EntryHeading({ organization, formerName, location, start, current, locale }) {
  const { formerly, present } = copy[locale];
  const date = start.length === 4 ? start : new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(start));

  return (
    <header className="cv-entry-heading">
      <div>
        <h3>{organization}{formerName && ` (${formerly} ${formerName})`}</h3>
        {location && <p className="cv-location">{location[locale]}</p>}
      </div>
      <p className="cv-period">
        <time dateTime={start}>{date}</time>{current && ` – ${present}`}
      </p>
    </header>
  );
}

export default function CV() {
  const { locale } = useLocale();
  const content = copy[locale];

  return (
    <div className="cv-page">
      <article className="cv-document" aria-labelledby="cv-name">
        <header className="cv-intro">
          <h1 id="cv-name">Julian Dower</h1>
          <p className="cv-role">{developerRole[locale]}</p>
          <p className="cv-summary">{content.summary}</p>
          <a className="cv-email" href={socialLinks.email}>{socialLinks.email.slice('mailto:'.length)}</a>
        </header>

        <section className="cv-section" aria-labelledby="cv-experience">
          <h2 id="cv-experience">{content.experience}</h2>
          <div className="cv-entries">
            {experience.map(({ role, contributions, ...heading }) => (
              <div key={heading.organization}>
                <EntryHeading {...heading} locale={locale} />
                <p className="cv-entry-role">{role[locale]}</p>
                <ul className="cv-contributions">
                  {contributions[locale].map(contribution => <li key={contribution}>{contribution}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="cv-section" aria-labelledby="cv-skills">
          <h2 id="cv-skills">{content.skills}</h2>
          <dl className="cv-skills">
            {skills.map(skill => {
              const [label, description] = skill[locale];
              return (
                <div key={skill.en[0]}>
                  <dt>{label}</dt>
                  <dd>{description}</dd>
                </div>
              );
            })}
          </dl>
        </section>

        <section className="cv-section" aria-labelledby="cv-education">
          <h2 id="cv-education">{content.education}</h2>
          <div className="cv-entries">
            {education.map(({ program, ...heading }) => (
              <div key={heading.organization}>
                <EntryHeading {...heading} locale={locale} />
                <p className="cv-entry-role">{program[locale]}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cv-section" aria-labelledby="cv-languages">
          <h2 id="cv-languages">{content.languages}</h2>
          <ul className="cv-languages">
            <li>{content.english}</li>
            <li>{content.german}</li>
            <li>{content.certificate}, <time dateTime="2023">2023</time></li>
          </ul>
        </section>
      </article>
    </div>
  );
}
