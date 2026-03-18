import React, { useState } from 'react';
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

const buildCarouselColumns = () => [
  [
    {
      id: 'overview',
      eyebrow: 'Overview',
      title: 'Clean surfaces, deliberate type, and motion that earns its keep.',
      body:
        'The feed now moves like a living rail instead of a static dump. It stays minimal, but it should feel active even before you touch it.',
      className: 'rail-wide tint-sun',
    },
    {
      id: 'quote',
      eyebrow: 'Pull line',
      title: '"Good interfaces should feel felt before they feel explained."',
      className: 'rail-quote tint-ice',
    },
    {
      id: 'feature',
      eyebrow: featuredProject.eyebrow,
      title: featuredProject.title,
      body: featuredProject.description,
      meta: featuredProject.liveNote,
      href: featuredProject.href,
      linkLabel: featuredProject.linkLabel,
      className: 'rail-feature tint-ocean',
    },
    {
      id: 'linked',
      eyebrow: 'Linked',
      title: 'One project card, intentionally.',
      body:
        'The page still points outward only once. Everything else is there to deepen the feel of the work around it.',
      className: 'rail-compact tint-mint',
    },
  ],
  [
    ...editorialPosts.map((post, index) => ({
      id: post.id,
      eyebrow: post.eyebrow,
      title: post.title,
      body: post.body,
      className: index === 1 ? 'rail-post tint-orchid' : 'rail-post tint-ice',
    })),
    ...utilityCards.slice(0, 2).map((card) => ({
      id: card.eyebrow.toLowerCase(),
      eyebrow: card.eyebrow,
      title: card.title,
      className: 'rail-compact tint-silver',
    })),
  ],
  [
    ...utilityCards.slice(2).map((card, index) => ({
      id: `${card.eyebrow.toLowerCase()}-${index}`,
      eyebrow: card.eyebrow,
      title: card.title,
      className: index === 0 ? 'rail-compact tint-ember' : 'rail-compact tint-mint',
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
      className: 'rail-ribbon tint-ocean',
    },
    {
      id: 'availability',
      eyebrow: 'Availability',
      title: 'Open to projects where product taste matters as much as implementation.',
      body:
        'Careful motion, calm systems, and interfaces with a point of view are the through-line.',
      className: 'rail-post tint-ice',
    },
  ],
];

const Home = () => {
  const carouselColumns = buildCarouselColumns();
  const [portraitAvailable, setPortraitAvailable] = useState(true);
  const portraitSrc = '/IMG_7920.JPG';

  const scrollToFeed = () => {
    document.getElementById('bento-feed')?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderCard = (item, key, isDuplicate = false) => {
    const content = (
      <>
        <span className="eyebrow">{item.eyebrow}</span>
        <h2 className={item.className.includes('rail-quote') ? 'quote-mark' : ''}>
          {item.title}
        </h2>
        {item.body ? <p>{item.body}</p> : null}
        {item.meta ? <span className="meta-note">{item.meta}</span> : null}
        {item.href ? (
          <span className="inline-link">
            <FaGithub size={16} />
            {item.linkLabel}
          </span>
        ) : null}
        {item.links ? (
          <div className="ribbon-links">
            {item.links.map((link) => (
              <span key={link.label} className="inline-link">
                {link.label}
              </span>
            ))}
          </div>
        ) : null}
      </>
    );

    if (item.href) {
      return (
        <motion.a
          key={key}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-hidden={isDuplicate}
          tabIndex={isDuplicate ? -1 : undefined}
          className={`bento-card marquee-card ${item.className}`}
          whileHover={{ y: -8, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.article
        key={key}
        aria-hidden={isDuplicate}
        className={`bento-card marquee-card ${item.className}`}
        whileHover={{ y: -8, scale: 1.015 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      >
        {content}
      </motion.article>
    );
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
          className="hero-note hero-portrait"
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
              A cleaner personal anchor in the hero so the page feels less abstract.
            </p>
          </div>
        </motion.aside>
      </section>

      <motion.section
        id="bento-feed"
        className="carousel-section"
        aria-label="Portfolio feed"
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="section-heading">
          <span className="eyebrow">Moving feed</span>
          <h2>An infinite vertical card loop with softer fades and more color in the hover state.</h2>
          <p>
            Hover any column to slow down and let the gradients fill. The motion stays
            minimal, but the page should feel alive now.
          </p>
        </div>

        <div className="carousel-columns">
          {carouselColumns.map((column, index) => (
            <div
              key={`column-${index}`}
              className="marquee-column"
              style={{ '--marquee-duration': `${28 + index * 4}s` }}
            >
              <div className={`marquee-stack${index % 2 === 1 ? ' reverse' : ''}`}>
                {[...column, ...column].map((item, itemIndex) => {
                  const isDuplicate = itemIndex >= column.length;

                  return renderCard(
                    item,
                    `${item.id}-${index}-${itemIndex}`,
                    isDuplicate
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
