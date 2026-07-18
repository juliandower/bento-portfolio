import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { socialLinks } from '../data/siteContent';

const contactItems = [
  { label: 'Email', detail: 'dower.julian@gmail.com', href: socialLinks.email },
  { label: 'GitHub', detail: 'github.com/juliandower', href: socialLinks.github },
  { label: 'SoundCloud', detail: 'soundcloud.com/yungjuan420', href: socialLinks.soundcloud },
];

const Contact = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="contact-page">
      <motion.section
        className="contact-intro"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="section-index">CONTACT / DIRECT LINE</span>
        <h1>Let’s make something<br /><em>with a pulse.</em></h1>
        <p>The best route is email. Tell me what you’re making, what feels unresolved, and where you want it to go.</p>
      </motion.section>

      <section className="contact-routes" aria-label="Ways to get in touch">
        {contactItems.map(({ label, detail, href }, index) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            className="contact-route"
          >
            <span>0{index + 1} / {label}</span>
            <strong>{detail}</strong>
            <FaArrowRight aria-hidden="true" />
          </a>
        ))}
      </section>

      <footer className="contact-footer">
        <span>© {new Date().getFullYear()} Julian Dower</span>
        <span>Software · Sound · Systems</span>
      </footer>
    </div>
  );
};

export default Contact;
