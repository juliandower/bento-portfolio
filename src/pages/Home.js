import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
  editorialPosts,
  featuredProject,
  socialLinks,
  utilityCards,
} from '../data/siteContent';
import { resetCardGlow, updateCardGlow } from '../utils/cardGlow';

const reveal = {
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
};

const editorialTones = ['tint-cloud', 'tint-sky', 'tint-frost'];
const utilityTones = ['tint-steel', 'tint-frost', 'tint-cloud', 'tint-steel'];

const Home = () => {
  const [portraitAvailable, setPortraitAvailable] = useState(true);
  const workRef = useRef(null);
  const portraitSrc = '/IMG_7920.JPG';
  const glowHandlers = {
    onMouseMove: updateCardGlow,
    onMouseLeave: resetCardGlow,
  };

  const scrollToWork = () => {
    workRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="page home-page">
      <section className="home-grid" aria-label="Portfolio overview">
        <motion.article
          initial={reveal.initial}
          animate={reveal.animate}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6 }}
          className="bento-card intro-card tint-frost span-7"
          {...glowHandlers}
        >
          <span className="eyebrow">Julian Dower</span>
          <h1>Fluid digital work across software, music, and design.</h1>
          <p className="lead">
            Clean systems, quiet motion, and interfaces that feel deliberate before
            they feel loud. This pass is static, responsive, and built to hold its
            shape on any screen.
          </p>
          <div className="hero-actions">
            <button type="button" className="primary-pill" onClick={scrollToWork}>
              View the work
              <FaArrowRight size={14} />
            </button>
            <Link className="secondary-pill" to="/contact">
              Contact
            </Link>
          </div>
        </motion.article>

        <motion.aside
          initial={reveal.initial}
          animate={reveal.animate}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6 }}
          className="bento-card portrait-card tint-steel span-5"
          {...glowHandlers}
        >
          <div className="portrait-frame">
            {portraitAvailable ? (
              <img
                src={portraitSrc}
                alt="Julian Dower portrait"
                className="portrait-image"
                onError={() => setPortraitAvailable(false)}
              />
            ) : (
              <div className="portrait-fallback" aria-hidden="true" />
            )}
          </div>

          <div className="portrait-caption">
            <span className="eyebrow">Portrait</span>
            <p>
              Product-minded builder with a bias toward pace, clarity, and visual
              restraint.
            </p>
          </div>
        </motion.aside>

        <motion.article
          ref={workRef}
          initial={reveal.initial}
          animate={reveal.animate}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6 }}
          className="bento-card feature-card tint-sky span-5"
          {...glowHandlers}
        >
          <span className="eyebrow">{featuredProject.eyebrow}</span>
          <h2>{featuredProject.title}</h2>
          <p>{featuredProject.description}</p>
          <span className="meta-note">{featuredProject.liveNote}</span>
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
          initial={reveal.initial}
          animate={reveal.animate}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6 }}
          className="bento-card feature-card tint-cloud span-4"
          {...glowHandlers}
        >
          <span className="eyebrow">Approach</span>
          <h2>Minimal, but not anonymous.</h2>
          <p>
            I like layouts that feel assembled rather than templated. The work should
            read clearly, but still leave some texture in the room.
          </p>
        </motion.article>

        <motion.article
          initial={reveal.initial}
          animate={reveal.animate}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6 }}
          className="bento-card quote-card tint-frost span-3"
          {...glowHandlers}
        >
          <span className="eyebrow">Pull line</span>
          <h2 className="quote-mark">
            Good interfaces should feel felt before they feel explained.
          </h2>
        </motion.article>

        {editorialPosts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={reveal.initial}
            animate={reveal.animate}
            transition={{
              duration: 0.62,
              delay: 0.24 + index * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -6 }}
            className={`bento-card story-card ${editorialTones[index % editorialTones.length]} span-4`}
            {...glowHandlers}
          >
            <span className="eyebrow">{post.eyebrow}</span>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </motion.article>
        ))}

        {utilityCards.map((card, index) => (
          <motion.article
            key={card.eyebrow}
            initial={reveal.initial}
            animate={reveal.animate}
            transition={{
              duration: 0.58,
              delay: 0.3 + index * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -6 }}
            className={`bento-card utility-card ${utilityTones[index % utilityTones.length]} span-3`}
            {...glowHandlers}
          >
            <span className="eyebrow">{card.eyebrow}</span>
            <h3>{card.title}</h3>
          </motion.article>
        ))}

        <motion.article
          initial={reveal.initial}
          animate={reveal.animate}
          transition={{ duration: 0.66, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6 }}
          className="bento-card ribbon-card tint-sky span-12"
          {...glowHandlers}
        >
          <div className="card-stack">
            <span className="eyebrow">Elsewhere</span>
            <h2>GitHub for code, SoundCloud for sketches, email for the direct route.</h2>
          </div>
          <div className="ribbon-links">
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a
              href={socialLinks.soundcloud}
              target="_blank"
              rel="noopener noreferrer"
            >
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
