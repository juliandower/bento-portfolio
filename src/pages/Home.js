import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
  editorialPosts,
  featuredProject,
  socialLinks,
  utilityCards,
} from '../data/siteContent';

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

const Home = () => {
  const scrollToFeed = () => {
    document.getElementById('bento-feed')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page home-page">
      <section className="hero-intro">
        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="hero-copy"
        >
          <span className="eyebrow">Julian Dower</span>
          <h1>Fluid digital work across software, music, and design.</h1>
          <p className="lead">
            A single long-form portfolio feed with soft gradients, tight copy, and
            one featured project worth opening.
          </p>
          <div className="hero-actions">
            <button type="button" className="primary-pill" onClick={scrollToFeed}>
              Explore the feed
              <FaArrowRight size={14} />
            </button>
            <Link className="secondary-pill" to="/contact">
              Contact
            </Link>
          </div>
        </motion.div>

        <motion.aside
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="hero-note"
        >
          <span className="eyebrow">Direction</span>
          <p>
            Minimalism only works when there is still enough texture to hold your
            attention. This page is built around that line.
          </p>
        </motion.aside>
      </section>

      <section id="bento-feed" className="bento-grid" aria-label="Portfolio feed">
        <motion.article
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="bento-card card-hero span-8"
        >
          <span className="eyebrow">Overview</span>
          <h2>Clean surfaces, deliberate type, and motion that earns its keep.</h2>
          <p>
            The work here leans editorial on purpose. Cards stack like notes instead
            of a project dump, so the page keeps moving without feeling noisy.
          </p>
        </motion.article>

        <motion.article
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="bento-card card-quote span-4"
        >
          <span className="eyebrow">Pull line</span>
          <p className="quote-mark">
            "Good interfaces should feel felt before they feel explained."
          </p>
        </motion.article>

        <motion.article
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.8, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="bento-card card-feature span-7"
        >
          <div className="card-stack">
            <span className="eyebrow">{featuredProject.eyebrow}</span>
            <h2>{featuredProject.title}</h2>
            <p>{featuredProject.description}</p>
            <span className="meta-note">{featuredProject.liveNote}</span>
          </div>
          <a
            href={featuredProject.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-link"
          >
            <FaGithub size={16} />
            {featuredProject.linkLabel}
          </a>
        </motion.article>

        <motion.article
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="bento-card card-mini span-5"
        >
          <span className="eyebrow">Linked</span>
          <h3>One project card, intentionally.</h3>
          <p>
            Rather than filling the page with repo tiles, the feed keeps the focus
            on one piece and lets the rest of the personality live in the writing.
          </p>
        </motion.article>

        {editorialPosts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{
              duration: 0.8,
              delay: 0.36 + index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="bento-card card-post span-4"
          >
            <span className="eyebrow">{post.eyebrow}</span>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </motion.article>
        ))}

        {utilityCards.map((card, index) => (
          <motion.article
            key={card.eyebrow}
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{
              duration: 0.75,
              delay: 0.56 + index * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`bento-card card-utility span-3 tone-${card.tone}`}
          >
            <span className="eyebrow">{card.eyebrow}</span>
            <h3>{card.title}</h3>
          </motion.article>
        ))}

        <motion.article
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.8, delay: 0.82, ease: [0.22, 1, 0.36, 1] }}
          className="bento-card card-ribbon span-12"
        >
          <div className="card-stack">
            <span className="eyebrow">Elsewhere</span>
            <h2>GitHub for code, SoundCloud for sketches, email for the direct route.</h2>
          </div>
          <div className="ribbon-links">
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href={socialLinks.soundcloud} target="_blank" rel="noopener noreferrer">
              SoundCloud
            </a>
            <a href={socialLinks.email}>Email</a>
          </div>
        </motion.article>
      </section>
    </div>
  );
};

export default Home;
