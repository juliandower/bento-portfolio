import React from 'react';
import { FaArrowDown, FaArrowRight, FaArrowUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { experiments, featuredProject, socialLinks, wispAnchorProject } from '../data/siteContent';

const SunsetComposition = () => (
  <div className="sunset-composition" aria-hidden="true">
    <svg viewBox="0 0 600 600" className="sunset-art">
      <defs>
        <linearGradient id="sunset" x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#ee9bc0" />
          <stop offset="50%" stopColor="#f78070" />
          <stop offset="100%" stopColor="#ffb45b" />
        </linearGradient>
      </defs>
      <circle cx="348" cy="248" r="205" fill="url(#sunset)" />
      <path className="sunset-arc" d="M76 590V340a174 174 0 0 1 348 0v140" fill="none" stroke="#f4eee7" strokeWidth="48" />
      <path d="M154 590V350a96 96 0 0 1 192 0v130" fill="none" stroke="#f4eee7" strokeWidth="2" />
      <circle cx="502" cy="503" r="44" fill="#f19abd" />
      <path d="M0 480h600" stroke="#191717" strokeWidth="3" />
    </svg>
  </div>
);

const ProjectLink = ({ project }) => (
  <a href={project.href} target="_blank" rel="noopener noreferrer" className="project-link">
    {project.linkLabel}<FaArrowRight aria-hidden="true" />
  </a>
);

const QuizVisual = () => (
  <figure className="project-preview quiz-preview">
    <div className="quiz-visual" role="img" aria-label="Illustrative wissenwert interface: a finance question, three possible answers, and a confidence slider.">
      <div className="visual-topline"><strong>wissenwert</strong><span>Round 4</span></div>
      <div className="quiz-content">
        <p>Which signal points to a tightening monetary policy?</p>
        <div className="quiz-options">
          <span>Falling base rates</span>
          <span className="is-selected">Rising base rates <FaArrowRight aria-hidden="true" /></span>
          <span>Wider money supply</span>
        </div>
      </div>
      <div className="confidence-scale"><span>Confidence</span><div className="scale-track"><i /></div><strong>72%</strong></div>
    </div>
    <figcaption>Illustrative interface</figcaption>
  </figure>
);

const MapVisual = () => (
  <figure className="project-preview map-preview">
    <div className="map-visual" role="img" aria-label="Illustrative wisp-anchor mind map connecting a product idea to audience, energy, format and friction.">
      <div className="visual-topline"><strong>wisp-anchor</strong><span>Voice to mind map</span></div>
      <svg viewBox="0 0 720 440" className="map-svg" aria-hidden="true">
        <g className="map-lines">
          <path d="M360 220C275 220 285 113 188 113" />
          <path d="M360 220C462 220 456 112 558 112" />
          <path d="M360 220C465 220 470 325 565 325" />
          <path d="M360 220C275 220 280 337 182 337" />
          <path d="M188 113C105 113 102 153 102 197" />
          <path d="M565 325C655 325 654 283 654 241" />
        </g>
        <g className="map-nodes">
          <g transform="translate(360 220)"><circle r="64" /><text textAnchor="middle" y="-5">Product</text><text textAnchor="middle" y="17">direction</text></g>
          <g transform="translate(188 113)"><circle r="48" /><text textAnchor="middle" y="5">Audience</text></g>
          <g transform="translate(558 112)"><circle r="44" /><text textAnchor="middle" y="5">Energy</text></g>
          <g transform="translate(565 325)"><circle r="44" /><text textAnchor="middle" y="5">Format</text></g>
          <g transform="translate(182 337)"><circle r="44" /><text textAnchor="middle" y="5">Friction</text></g>
          <g transform="translate(102 197)"><circle r="25" /><text textAnchor="middle" y="5">Who?</text></g>
          <g transform="translate(654 241)"><circle r="25" /><text textAnchor="middle" y="5">Why?</text></g>
        </g>
      </svg>
    </div>
    <figcaption>Illustrative interface</figcaption>
  </figure>
);

const Home = () => (
  <div className="home-page">
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">Julian<br />Dower<span>.</span></h1>
        <p className="hero-discipline">Product thinking,<br />interface design & code.</p>
        <a href="#work-title" className="text-button">Explore my work<FaArrowDown aria-hidden="true" /></a>
      </div>
      <SunsetComposition />
    </section>

    <section className="work-section" aria-labelledby="work-title">
      <div className="section-heading"><h2 id="work-title">Selected work</h2><span>Two live projects</span></div>
      <article className="project project-wissenwert">
        <div className="project-copy">
          <h3>{featuredProject.title}</h3>
          <p className="project-description">{featuredProject.description}</p>
          <p className="project-format">Interactive quiz</p>
          <ProjectLink project={featuredProject} />
        </div>
        <QuizVisual />
      </article>
      <article className="project project-wisp">
        <div className="project-copy">
          <h3>{wispAnchorProject.title}</h3>
          <p className="project-description">{wispAnchorProject.description}</p>
          <p className="project-format">Voice-to-map tool</p>
          <ProjectLink project={wispAnchorProject} />
        </div>
        <MapVisual />
      </article>
    </section>

    <section className="about-section" aria-labelledby="about-title">
      <h2 id="about-title">About</h2>
      <div className="about-copy">
        <p className="about-lead">I make focused digital products, from first sketch to live release.</p>
        <div><p>I’m an independent builder working across product thinking, interface design and code.</p><p>Music production shapes my approach. I’m interested in tools that help people think, learn and make sense of messy inputs.</p></div>
      </div>
      <div className="experiment-list" aria-label="Other interests">
        {experiments.map((item) => <article className="experiment" key={item.title}><h3>{item.title}</h3><p>{item.description}</p></article>)}
      </div>
    </section>

    <section className="contact-cta" aria-labelledby="contact-title">
      <div className="contact-geometry" aria-hidden="true"><i /><i /></div>
      <h2 id="contact-title">Let’s talk.</h2>
      <a href={socialLinks.email} className="email-link">dower.julian@gmail.com<FaArrowRight aria-hidden="true" /></a>
      <footer className="footer-line">
        <span>© {new Date().getFullYear()} Julian Dower</span>
        <div><a href={socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub</a><a href={socialLinks.soundcloud} target="_blank" rel="noopener noreferrer">SoundCloud</a><Link to="/contact">Contact</Link><a href="#hero-title" aria-label="Back to top"><FaArrowUp aria-hidden="true" /></a></div>
      </footer>
    </section>
  </div>
);

export default Home;
