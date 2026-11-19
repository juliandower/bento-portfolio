import React, { useRef } from 'react';
import { FaArrowDown, FaArrowRight, FaArrowUp, FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { experiments, featuredProject, socialLinks, wispAnchorProject } from '../data/siteContent';
import Atmosphere from '../Atmosphere';

const ProjectLink = ({ project }) => (
  <a href={project.href} target="_blank" rel="noopener noreferrer" className="project-link">
    {project.linkLabel}<FaArrowUpRightFromSquare aria-hidden="true" />
  </a>
);

const QuizVisual = () => (
  <figure className="project-preview quiz-preview">
    <div className="quiz-visual" role="img" aria-label="Illustrative wissenwert interface: a finance question, three possible answers, and a confidence slider.">
      <div className="visual-topline"><strong>wissenwert</strong><span>Round 4</span></div>
      <div className="quiz-content">
        <p>Which signal points to a tightening monetary policy?</p>
        <div className="quiz-options"><span>Falling base rates</span><span className="is-selected">Rising base rates <FaArrowRight aria-hidden="true" /></span><span>Wider money supply</span></div>
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
        <g className="map-lines"><path d="M360 220C275 220 285 113 188 113" /><path d="M360 220C462 220 456 112 558 112" /><path d="M360 220C465 220 470 325 565 325" /><path d="M360 220C275 220 280 337 182 337" /><path d="M188 113C105 113 102 153 102 197" /><path d="M565 325C655 325 654 283 654 241" /></g>
        <g className="map-nodes"><g transform="translate(360 220)"><circle r="64" /><text textAnchor="middle" y="-5">Product</text><text textAnchor="middle" y="17">direction</text></g><g transform="translate(188 113)"><circle r="48" /><text textAnchor="middle" y="5">Audience</text></g><g transform="translate(558 112)"><circle r="44" /><text textAnchor="middle" y="5">Energy</text></g><g transform="translate(565 325)"><circle r="44" /><text textAnchor="middle" y="5">Format</text></g><g transform="translate(182 337)"><circle r="44" /><text textAnchor="middle" y="5">Friction</text></g><g transform="translate(102 197)"><circle r="25" /><text textAnchor="middle" y="5">Who?</text></g><g transform="translate(654 241)"><circle r="25" /><text textAnchor="middle" y="5">Why?</text></g></g>
      </svg>
    </div>
    <figcaption>Illustrative interface</figcaption>
  </figure>
);

const Hero = () => {
  const introRef = useRef(null);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <Atmosphere introRef={introRef} />
      <div className="hero-copy">
        <div className="hero-intro" ref={introRef}>
          <div className="hero-availability"><span /> Independent creative developer</div>
          <h1 id="hero-title">Julian<br />Dower<span>.</span></h1>
          <p className="hero-discipline">Product thinking, interface design &amp; code.</p>
        </div>
        <a href="#work-title" className="hero-button">Explore my work <span><FaArrowDown aria-hidden="true" /></span></a>
      </div>
      <div className="hero-side-note" aria-hidden="true"><span>IDEAS INTO INTERFACES</span><i /></div>
      <div className="hero-bottom"><span>PORTFOLIO / {new Date().getFullYear()}</span><span>SCROLL TO EXPLORE <FaArrowDown /></span></div>
    </section>
  );
};

const Home = () => (
  <div className="home-page">
    <Hero />
    <section className="work-section" aria-labelledby="work-title">
      <div className="section-heading"><div><span className="section-label">A SELECTION OF PROJECTS</span><h2 id="work-title">Made with intention.</h2></div><p>A couple of ideas, brought to life.</p></div>
      <div className="project-grid">
        <article className="project project-wissenwert"><QuizVisual /><div className="project-copy"><div className="project-meta"><span>INTERACTIVE QUIZ</span><span>LIVE PROJECT ↗</span></div><h3>{featuredProject.title}</h3><p className="project-description">{featuredProject.description}</p><ProjectLink project={featuredProject} /></div></article>
        <article className="project project-wisp"><MapVisual /><div className="project-copy"><div className="project-meta"><span>VOICE-TO-MAP TOOL</span><span>LIVE PROJECT ↗</span></div><h3>{wispAnchorProject.title}</h3><p className="project-description">{wispAnchorProject.description}</p><ProjectLink project={wispAnchorProject} /></div></article>
      </div>
    </section>

    <section className="about-section" aria-labelledby="about-title">
      <div className="about-heading"><span className="section-label">A LITTLE ABOUT ME</span><h2 id="about-title">Curiosity, made tangible.</h2></div>
      <div className="about-copy"><p className="about-lead">I make focused digital products, from first sketch to live release.</p><div><p>I’m an independent builder working across product thinking, interface design and code.</p><p>Music production shapes my approach. I’m interested in tools that help people think, learn and make sense of messy inputs.</p></div></div>
      <div className="experiment-list" aria-label="Other interests">{experiments.map((item) => <article className="experiment" key={item.title}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
    </section>

    <section className="contact-cta" aria-labelledby="contact-title"><div className="contact-glow" aria-hidden="true" /><div className="contact-inner"><span className="section-label">HAVE SOMETHING IN MIND?</span><h2 id="contact-title">Let’s make<br />something good.</h2><a href={socialLinks.email} className="email-link">Get in touch <FaArrowRight aria-hidden="true" /></a><footer className="footer-line"><span>© {new Date().getFullYear()} Julian Dower</span><div><a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a><a href={socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub</a><a href={socialLinks.soundcloud} target="_blank" rel="noopener noreferrer">SoundCloud</a><Link to="/contact">Contact</Link><a href="#main-content" aria-label="Back to top"><FaArrowUp aria-hidden="true" /></a></div></footer></div></section>
  </div>
);
export default Home;
