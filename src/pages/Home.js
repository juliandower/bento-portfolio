import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
  experiments,
  featuredProject,
  socialLinks,
  wispAnchorProject,
} from '../data/siteContent';

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const SignalField = () => {
  const fieldRef = useRef(null);

  const moveSignal = (event) => {
    if (!fieldRef.current) return;
    const bounds = fieldRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    fieldRef.current.style.setProperty('--signal-x', `${x * 18}px`);
    fieldRef.current.style.setProperty('--signal-y', `${y * 12}px`);
  };

  const resetSignal = () => {
    fieldRef.current?.style.removeProperty('--signal-x');
    fieldRef.current?.style.removeProperty('--signal-y');
  };

  return (
    <div
      ref={fieldRef}
      className="signal-field"
      onPointerMove={moveSignal}
      onPointerLeave={resetSignal}
      aria-hidden="true"
    >
      <div className="signal-coordinate signal-coordinate-top">INPUT / OUTPUT</div>
      <svg viewBox="0 0 1000 360" preserveAspectRatio="none" className="signal-svg">
        <path className="signal-path signal-path-ghost" d="M0 191 C72 191 78 121 150 121 S230 260 304 260 386 70 464 70 538 224 614 224 688 150 758 150 842 197 1000 197" />
        <path className="signal-path signal-path-main" d="M0 191 C72 191 78 121 150 121 S230 260 304 260 386 70 464 70 538 224 614 224 688 150 758 150 842 197 1000 197" />
        <path className="signal-path signal-path-fine" d="M0 191 C72 191 78 121 150 121 S230 260 304 260 386 70 464 70 538 224 614 224 688 150 758 150 842 197 1000 197" />
        <circle className="signal-node signal-node-one" cx="304" cy="260" r="7" />
        <circle className="signal-node signal-node-two" cx="614" cy="224" r="7" />
        <circle className="signal-node signal-node-three" cx="758" cy="150" r="7" />
      </svg>
      <div className="signal-coordinate signal-coordinate-bottom">SOFTWARE · SOUND · SYSTEMS</div>
    </div>
  );
};

const ProjectLink = ({ project }) => (
  <a
    href={project.href}
    target="_blank"
    rel="noopener noreferrer"
    className="project-link"
  >
    <span>{project.linkLabel}</span>
    <FaArrowRight aria-hidden="true" />
  </a>
);

const ProjectMeta = ({ items }) => (
  <dl className="project-meta">
    {items.map(({ label, value }) => (
      <div key={label}>
        <dt>{label}</dt>
        <dd>{value}</dd>
      </div>
    ))}
  </dl>
);

const QuizVisual = () => (
  <div className="project-visual quiz-visual" aria-hidden="true">
    <div className="visual-topline">
      <span>WISSENWERT / ROUND 04</span>
      <span>€ 2,450</span>
    </div>
    <div className="quiz-content">
      <span className="quiz-category">MARKETS</span>
      <p>Which signal most often points to a tightening monetary policy?</p>
      <div className="quiz-options">
        <span>Falling base rates</span>
        <span className="is-selected">Rising base rates</span>
        <span>Wider money supply</span>
      </div>
    </div>
    <div className="confidence-scale">
      <span>CONFIDENCE</span>
      <div className="scale-track"><i /></div>
      <strong>72%</strong>
    </div>
  </div>
);

const MapVisual = () => (
  <div className="project-visual map-visual" aria-hidden="true">
    <div className="visual-topline">
      <span>WISP / LIVE THOUGHT</span>
      <span className="recording-dot">LISTENING</span>
    </div>
    <svg viewBox="0 0 720 440" className="map-svg">
      <g className="map-lines">
        <path d="M360 220 L188 113" />
        <path d="M360 220 L558 112" />
        <path d="M360 220 L565 325" />
        <path d="M360 220 L182 337" />
        <path d="M188 113 L102 197" />
        <path d="M565 325 L654 241" />
      </g>
      <g className="map-nodes">
        <g transform="translate(360 220)"><circle r="58" /><text textAnchor="middle" y="-4">NEW PRODUCT</text><text textAnchor="middle" y="14">DIRECTION</text></g>
        <g transform="translate(188 113)"><circle r="42" /><text textAnchor="middle" y="4">AUDIENCE</text></g>
        <g transform="translate(558 112)"><circle r="42" /><text textAnchor="middle" y="4">ENERGY</text></g>
        <g transform="translate(565 325)"><circle r="42" /><text textAnchor="middle" y="4">FORMAT</text></g>
        <g transform="translate(182 337)"><circle r="42" /><text textAnchor="middle" y="4">FRICTION</text></g>
        <g transform="translate(102 197)"><circle r="25" /><text textAnchor="middle" y="4">WHO?</text></g>
        <g transform="translate(654 241)"><circle r="25" /><text textAnchor="middle" y="4">WHY?</text></g>
      </g>
    </svg>
    <div className="transcript-line">“...maybe the map should reveal what I’m actually trying to say.”</div>
  </div>
);

const Home = () => {
  const reduceMotion = useReducedMotion();
  const workRef = useRef(null);
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.7, ease: [0.22, 1, 0.36, 1] };

  return (
    <div className="home-page">
      <section className="hero" aria-labelledby="hero-title">
        <motion.div initial="hidden" animate="visible" variants={reveal} transition={transition} className="hero-copy">
          <div className="hero-kicker">
            <span>JULIAN DOWER</span>
            <span>INDEPENDENT / REMOTE</span>
          </div>
          <h1 id="hero-title">I build digital things <em>with a pulse.</em></h1>
          <div className="hero-bottom">
            <p>Software, sound and visual systems—made to feel clear, alive and worth returning to.</p>
            <button type="button" className="text-button" onClick={() => workRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })}>
              Selected work <span aria-hidden="true">↓</span>
            </button>
          </div>
        </motion.div>
        <SignalField />
      </section>

      <section className="work-section" ref={workRef} aria-labelledby="work-title">
        <div className="section-heading">
          <span className="section-index">01</span>
          <h2 id="work-title">Selected work</h2>
          <p>Two live products built around a simple idea: interaction should change how information feels.</p>
        </div>

        <motion.article className="project project-wissenwert" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} variants={reveal} transition={transition}>
          <div className="project-copy">
            <span className="project-number">01 / 02</span>
            <h3>{featuredProject.title}</h3>
            <p className="project-tagline">{featuredProject.tagline}</p>
            <p className="project-description">{featuredProject.description}</p>
            <ProjectMeta items={featuredProject.meta} />
            <ProjectLink project={featuredProject} />
          </div>
          <QuizVisual />
        </motion.article>

        <motion.article className="project project-wisp" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} variants={reveal} transition={transition}>
          <MapVisual />
          <div className="project-copy">
            <span className="project-number">02 / 02</span>
            <h3>{wispAnchorProject.title}</h3>
            <p className="project-tagline">{wispAnchorProject.tagline}</p>
            <p className="project-description">{wispAnchorProject.description}</p>
            <ProjectMeta items={wispAnchorProject.meta} />
            <ProjectLink project={wispAnchorProject} />
          </div>
        </motion.article>
      </section>

      <section className="experiments-section" aria-labelledby="experiments-title">
        <div className="section-heading compact-heading">
          <span className="section-index">02</span>
          <h2 id="experiments-title">Off-frequency</h2>
        </div>
        <div className="experiment-list">
          {experiments.map((item, index) => (
            <article className="experiment" key={item.title}>
              <span>0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-title">
        <div className="section-heading compact-heading">
          <span className="section-index">03</span>
          <h2 id="about-title">Context</h2>
        </div>
        <div className="about-copy">
          <p className="about-lead">I’m Julian—an independent builder working where product thinking, interface design and code overlap.</p>
          <div>
            <p>I make small, focused products from first sketch to live release. Music production shapes how I think about software: rhythm, tension, silence and payoff all matter.</p>
            <p>Right now I’m interested in tools that help people think, learn and make sense of messy inputs.</p>
          </div>
        </div>
      </section>

      <section className="contact-cta" aria-labelledby="contact-title">
        <span className="section-index">04 / CONTACT</span>
        <h2 id="contact-title">Have a signal<br />worth following?</h2>
        <a href={socialLinks.email} className="email-link">dower.julian@gmail.com <FaArrowRight aria-hidden="true" /></a>
        <div className="footer-line">
          <span>© {new Date().getFullYear()} Julian Dower</span>
          <div>
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={socialLinks.soundcloud} target="_blank" rel="noopener noreferrer">SoundCloud</a>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
