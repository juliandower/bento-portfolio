import React, { useRef } from 'react';
import { FaArrowDown, FaArrowRight, FaArrowUp, FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { featuredProject, siteCopy, socialLinks, wispAnchorProject } from '../data/siteContent';
import Atmosphere from '../Atmosphere';
import ContactOrb from '../ContactOrb';
import { useLocale } from '../locale';

const ProjectLink = ({ project, label }) => (
  <a href={project.href} target="_blank" rel="noopener noreferrer" className="project-link">
    {label}<FaArrowUpRightFromSquare aria-hidden="true" />
  </a>
);

const QuizVisual = ({ copy }) => (
  <figure className="project-preview quiz-preview">
    <div className="quiz-visual" role="img" aria-label={copy.quiz.alt}>
      <div className="visual-topline"><strong>wissenwert</strong><span>{copy.quiz.round}</span></div>
      <div className="quiz-content">
        <p>{copy.quiz.question}</p>
        <div className="quiz-options">
          <span>{copy.quiz.answers[0]}</span>
          <span className="is-selected">{copy.quiz.answers[1]} <FaArrowRight aria-hidden="true" /></span>
          <span>{copy.quiz.answers[2]}</span>
        </div>
      </div>
      <div className="confidence-scale"><span>{copy.quiz.confidence}</span><div className="scale-track"><i /></div><strong>72%</strong></div>
    </div>
    <figcaption>{copy.illustration}</figcaption>
  </figure>
);

const MapVisual = ({ copy }) => (
  <figure className="project-preview map-preview">
    <div className="map-visual" role="img" aria-label={copy.map.alt}>
      <div className="visual-topline"><strong>wisp-anchor</strong><span>{copy.map.label}</span></div>
      <svg viewBox="0 0 720 440" className="map-svg" aria-hidden="true">
        <g className="map-lines"><path d="M360 220C275 220 285 113 188 113" /><path d="M360 220C462 220 456 112 558 112" /><path d="M360 220C465 220 470 325 565 325" /><path d="M360 220C275 220 280 337 182 337" /><path d="M188 113C105 113 102 153 102 197" /><path d="M565 325C655 325 654 283 654 241" /></g>
        <g className="map-nodes">
          <g transform="translate(360 220)"><circle r="64" /><text textAnchor="middle" y="-5">{copy.map.nodes[0]}</text><text textAnchor="middle" y="17">{copy.map.nodes[1]}</text></g>
          <g transform="translate(188 113)"><circle r="48" /><text textAnchor="middle" y="5">{copy.map.nodes[2]}</text></g>
          <g transform="translate(558 112)"><circle r="44" /><text textAnchor="middle" y="5">{copy.map.nodes[3]}</text></g>
          <g transform="translate(565 325)"><circle r="44" /><text textAnchor="middle" y="5">{copy.map.nodes[4]}</text></g>
          <g transform="translate(182 337)"><circle r="44" /><text textAnchor="middle" y="5">{copy.map.nodes[5]}</text></g>
          <g transform="translate(102 197)"><circle r="25" /><text textAnchor="middle" y="5">{copy.map.nodes[6]}</text></g>
          <g transform="translate(654 241)"><circle r="25" /><text textAnchor="middle" y="5">{copy.map.nodes[7]}</text></g>
        </g>
      </svg>
    </div>
    <figcaption>{copy.illustration}</figcaption>
  </figure>
);

const Hero = ({ viewWork }) => {
  const titleRef = useRef(null);

  return (
    <div className="hero-stage" id="home" tabIndex={-1}>
      <section className="hero" aria-labelledby="hero-title">
        <Atmosphere titleRef={titleRef} />
        <div className="hero-copy">
          <h1 id="hero-title" ref={titleRef}>Julian<br />Dower<span>.</span></h1>
          <Link to="/#work-title" className="hero-button">
            {viewWork} <FaArrowDown aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
};

const projectEntries = [[featuredProject, QuizVisual], [wispAnchorProject, MapVisual]];

const Home = () => {
  const { locale } = useLocale();
  const copy = siteCopy[locale];

  return (
    <div className="home-page">
      <Hero viewWork={copy.viewWork} />
      <section className="work-section" aria-labelledby="work-title">
        <h2 id="work-title" tabIndex={-1}>{copy.work}</h2>
        <div className="project-grid">
          {projectEntries.map(([project, Visual]) => (
            <article className="project" key={project.title}>
              <Visual copy={copy} />
              <div className="project-copy">
                <h3>{project.title}</h3>
                <p className="project-description">{project[locale].description}</p>
                <ProjectLink project={project} label={project[locale].linkLabel} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-title">
        <h2 id="about-title">{copy.about}</h2>
        <div className="about-copy">
          <p>{copy.bio}</p>
          <Link to="/cv" className="project-link">{copy.cv} <FaArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="contact-cta" aria-labelledby="contact-title">
        <ContactOrb className="contact-glow" distance={9} scrollDistance={36} />
        <div className="contact-inner">
          <h2 id="contact-title" tabIndex={-1}>{copy.contact}</h2>
          <a href={socialLinks.email} className="email-link">{copy.emailMe} <FaArrowRight aria-hidden="true" /></a>
          <footer className="footer-line">
            <span>© {new Date().getFullYear()} Julian Dower</span>
            <div>
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href={socialLinks.soundcloud} target="_blank" rel="noopener noreferrer">SoundCloud</a>
              <Link to="/contact">{copy.contactDetails}</Link>
              <Link to="/#home" className="back-to-top" aria-label={copy.backToTop}><FaArrowUp aria-hidden="true" /></Link>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
};
export default Home;
