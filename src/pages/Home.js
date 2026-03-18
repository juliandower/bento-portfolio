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

const feedTemplates = [
  {
    id: 'overview',
    eyebrow: 'Overview',
    title: 'Clean surfaces, deliberate type, and motion that earns its keep.',
    body:
      'This version behaves like a proper scroll system. The cards do not move until you move, and the stack keeps renewing itself underneath the header.',
    className: 'stack-wide tint-sun',
  },
  {
    id: 'feature',
    eyebrow: featuredProject.eyebrow,
    title: featuredProject.title,
    body: featuredProject.description,
    meta: featuredProject.liveNote,
    href: featuredProject.href,
    linkLabel: featuredProject.linkLabel,
    className: 'stack-feature tint-ocean',
  },
  {
    id: 'quote',
    eyebrow: 'Pull line',
    title: '"Good interfaces should feel felt before they feel explained."',
    className: 'stack-quote tint-ice',
  },
  ...editorialPosts.map((post, index) => ({
    id: post.id,
    eyebrow: post.eyebrow,
    title: post.title,
    body: post.body,
    className: index === 1 ? 'stack-card tint-orchid' : 'stack-card tint-ice',
  })),
  ...utilityCards.map((card, index) => ({
    id: `${card.eyebrow.toLowerCase()}-${index}`,
    eyebrow: card.eyebrow,
    title: card.title,
    className:
      index === 0
        ? 'stack-compact tint-silver'
        : index === 1
          ? 'stack-compact tint-mint'
          : index === 2
            ? 'stack-compact tint-ember'
            : 'stack-compact tint-ice',
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
    className: 'stack-ribbon tint-ocean',
  },
];

const INITIAL_CARD_COUNT = feedTemplates.length;
const BATCH_SIZE = 6;
const MAX_CARD_COUNT = 26;
const ESTIMATED_CARD_HEIGHT = 320;
const CARD_GAP = 18;

const buildFeedBatch = (start, count) =>
  Array.from({ length: count }, (_, offset) => {
    const index = start + offset;
    const template = feedTemplates[index % feedTemplates.length];

    return {
      ...template,
      id: `${template.id}-${index}`,
      sequence: index,
    };
  });

const Home = () => {
  const [portraitAvailable, setPortraitAvailable] = useState(true);
  const [cards, setCards] = useState(() => buildFeedBatch(0, INITIAL_CARD_COUNT));
  const portraitSrc = '/IMG_7920.JPG';
  const feedMarkerRef = useRef(null);
  const scrollWindowRef = useRef(null);
  const cardRefs = useRef(new Map());
  const cardsRef = useRef(cards);
  const nextIndexRef = useRef(INITIAL_CARD_COUNT);
  const mutatingRef = useRef(false);

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  useEffect(() => {
    const scroller = scrollWindowRef.current;

    if (!scroller) {
      return undefined;
    }

    if (scroller.scrollHeight <= scroller.clientHeight + 200) {
      const nextCards = [
        ...cardsRef.current,
        ...buildFeedBatch(nextIndexRef.current, BATCH_SIZE),
      ];

      nextIndexRef.current += BATCH_SIZE;
      cardsRef.current = nextCards;
      setCards(nextCards);
    }

    return undefined;
  }, []);

  const scrollToFeed = () => {
    feedMarkerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const recycleFeed = () => {
    const scroller = scrollWindowRef.current;

    if (!scroller || mutatingRef.current) {
      return;
    }

    mutatingRef.current = true;

    const appendedCards = buildFeedBatch(nextIndexRef.current, BATCH_SIZE);
    nextIndexRef.current += BATCH_SIZE;

    const extendedCards = [...cardsRef.current, ...appendedCards];
    let nextCards = extendedCards;
    let removedHeight = 0;

    if (scroller.scrollTop > 1100 && extendedCards.length > MAX_CARD_COUNT) {
      const removedCards = extendedCards.slice(0, BATCH_SIZE);

      removedHeight = removedCards.reduce((total, card) => {
        const node = cardRefs.current.get(card.id);

        return total + (node?.offsetHeight || ESTIMATED_CARD_HEIGHT) + CARD_GAP;
      }, 0);

      nextCards = extendedCards.slice(BATCH_SIZE);
    }

    cardsRef.current = nextCards;
    setCards(nextCards);

    requestAnimationFrame(() => {
      if (removedHeight > 0) {
        scroller.scrollTop -= removedHeight;
      }

      mutatingRef.current = false;
    });
  };

  const handleScroll = (event) => {
    const scroller = event.currentTarget;

    if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 900) {
      recycleFeed();
    }
  };

  const renderCard = (item) => {
    const content = (
      <>
        <span className="eyebrow">{item.eyebrow}</span>
        <h2 className={item.className.includes('stack-quote') ? 'quote-mark' : ''}>
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
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          ref={(node) => {
            if (node) {
              cardRefs.current.set(item.id, node);
            } else {
              cardRefs.current.delete(item.id);
            }
          }}
          className={`bento-card feed-card ${item.className}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -8, scale: 1.015 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.article
        key={item.id}
        ref={(node) => {
          if (node) {
            cardRefs.current.set(item.id, node);
          } else {
            cardRefs.current.delete(item.id);
          }
        }}
        className={`bento-card feed-card ${item.className}`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, scale: 1.015 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {content}
      </motion.article>
    );
  };

  return (
    <div className="page home-page">
      <div className="scroll-window-shell">
        <div
          className="scroll-window"
          onScroll={handleScroll}
          ref={scrollWindowRef}
        >
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
                A single long-form portfolio feed with soft gradients, tight copy,
                and one featured project worth opening.
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
                  A cleaner personal anchor in the hero so the page feels less
                  abstract.
                </p>
              </div>
            </motion.aside>
          </section>

          <motion.section
            id="bento-feed"
            ref={feedMarkerRef}
            className="carousel-section"
            aria-label="Portfolio feed"
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="section-heading">
              <span className="eyebrow">Scroll feed</span>
              <h2>A single vertical stream that renews itself as you move through it.</h2>
              <p>
                The header stays fixed. The cards only advance when you scroll, then
                recycle out of view and return later in the sequence.
              </p>
            </div>

            <div className="feed-stack" role="list" aria-label="Infinite portfolio cards">
              {cards.map((item) => renderCard(item))}
            </div>

            <div className="feed-tail">
              <span className="eyebrow">Continuous</span>
              <p>Keep scrolling. The stack keeps refreshing from below.</p>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default Home;
