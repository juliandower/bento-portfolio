import React, { useEffect, useRef, useState } from 'react';
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

const homeCards = [
  {
    id: 'overview',
    eyebrow: 'Overview',
    title: 'A portfolio that feels editorial, spatial, and a little more human.',
    body:
      'Software, music, and design all sit in the same visual system here. The goal is clean structure with enough color and motion to keep the page from going flat.',
    className: 'feature-card tint-sun span-6',
  },
  {
    id: 'feature',
    eyebrow: featuredProject.eyebrow,
    title: featuredProject.title,
    body: featuredProject.description,
    meta: featuredProject.liveNote,
    href: featuredProject.href,
    linkLabel: featuredProject.linkLabel,
    className: 'feature-card tint-ocean span-6',
  },
  {
    id: 'quote',
    eyebrow: 'Pull line',
    title: '"Good interfaces should feel felt before they feel explained."',
    className: 'quote-card tint-ice span-4',
  },
  ...editorialPosts.map((post, index) => ({
    id: post.id,
    eyebrow: post.eyebrow,
    title: post.title,
    body: post.body,
    className: `story-card ${index === 1 ? 'tint-orchid' : 'tint-ice'} span-4`,
  })),
  ...utilityCards.map((card, index) => ({
    id: `${card.eyebrow.toLowerCase()}-${index}`,
    eyebrow: card.eyebrow,
    title: card.title,
    className: `utility-card ${
      index === 0
        ? 'tint-silver'
        : index === 1
          ? 'tint-mint'
          : index === 2
            ? 'tint-ember'
            : 'tint-ice'
    } span-3`,
  })),
  {
    id: 'connect',
    eyebrow: 'Elsewhere',
    title: 'GitHub for code, SoundCloud for sketches, email for the direct route.',
    links: [
      { label: 'GitHub', href: socialLinks.github },
      { label: 'SoundCloud', href: socialLinks.soundcloud },
      { label: 'Email', href: socialLinks.email },
    ],
    className: 'ribbon-card tint-ocean span-12',
  },
];

const INITIAL_LOOP_COUNT = homeCards.length + 4;
const LOOP_BATCH_SIZE = 6;

const buildLoopBatch = (start, count) =>
  Array.from({ length: count }, (_, offset) => {
    const sequence = start + offset;
    const template =
      homeCards[((sequence % homeCards.length) + homeCards.length) % homeCards.length];

    return {
      ...template,
      id: `${template.id}-${sequence}`,
    };
  });

const Home = () => {
  const [portraitAvailable, setPortraitAvailable] = useState(true);
  const [loopCards, setLoopCards] = useState(() =>
    buildLoopBatch(0, INITIAL_LOOP_COUNT)
  );
  const portraitSrc = '/IMG_7920.JPG';
  const nextSequenceRef = useRef(INITIAL_LOOP_COUNT);
  const loadingRef = useRef(false);

  const scrollToFeed = () => {
    document.getElementById('portfolio-grid')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  useEffect(() => {
    const handleWindowScroll = () => {
      if (loadingRef.current) {
        return;
      }

      const threshold = 1400;
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - threshold;

      if (!scrolledToBottom) {
        return;
      }

      loadingRef.current = true;

      setLoopCards((currentCards) => [
        ...currentCards,
        ...buildLoopBatch(nextSequenceRef.current, LOOP_BATCH_SIZE),
      ]);

      nextSequenceRef.current += LOOP_BATCH_SIZE;

      requestAnimationFrame(() => {
        loadingRef.current = false;
      });
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, []);

  const renderCard = (card, index) => {
    const content = (
      <>
        <span className="eyebrow">{card.eyebrow}</span>
        <h2 className={card.className.includes('quote-card') ? 'quote-mark' : ''}>
          {card.title}
        </h2>
        {card.body ? <p>{card.body}</p> : null}
        {card.meta ? <span className="meta-note">{card.meta}</span> : null}
        {card.href ? (
          <span className="inline-link">
            <FaGithub size={16} />
            {card.linkLabel}
          </span>
        ) : null}
        {card.links ? (
          <div className="ribbon-links">
            {card.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </>
    );

    if (card.href) {
      return (
        <motion.a
          key={card.id}
          href={card.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`bento-card ${card.className}`}
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{
            duration: 0.5,
            delay: 0.14 + index * 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{ y: -8, scale: 1.015 }}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.article
        key={card.id}
        className={`bento-card ${card.className}`}
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{
          duration: 0.5,
          delay: 0.14 + index * 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={{ y: -8, scale: 1.015 }}
      >
        {content}
      </motion.article>
    );
  };

  return (
    <div className="page home-page">
      <section className="home-grid" id="portfolio-grid">
        <motion.article
          className="bento-card intro-card tint-ice span-7"
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow">Julian Dower</span>
          <h1>Fluid digital work across software, music, and design.</h1>
          <p className="lead">
            A cleaner first pass at the portfolio: one sticky header, one page scroll,
            and a tighter bento composition where the intro, portrait, featured work,
            and editorial notes all belong to the same surface.
          </p>
          <div className="hero-actions">
            <button type="button" className="primary-pill" onClick={scrollToFeed}>
              View the work
              <FaArrowRight size={14} />
            </button>
            <Link className="secondary-pill" to="/contact">
              Contact
            </Link>
          </div>
        </motion.article>

        <motion.aside
          className="bento-card portrait-card tint-silver span-5"
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
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
          <div className="portrait-caption">
            <span className="eyebrow">Portrait</span>
            <p>
              Personal anchor first, then the work around it. This keeps the top of
              the page from feeling like a detached intro block.
            </p>
          </div>
        </motion.aside>

        {loopCards.map((card, index) => renderCard(card, index))}
      </section>
    </div>
  );
};

export default Home;
