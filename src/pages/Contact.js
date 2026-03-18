import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaSoundcloud } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { socialLinks } from '../data/siteContent';
import { resetCardGlow, updateCardGlow } from '../utils/cardGlow';

const contactItems = [
  {
    label: 'Email',
    detail: 'dower.julian@gmail.com',
    href: socialLinks.email,
    icon: MdEmail,
  },
  {
    label: 'GitHub',
    detail: 'github.com/juliandower',
    href: socialLinks.github,
    icon: FaGithub,
  },
  {
    label: 'SoundCloud',
    detail: 'soundcloud.com/yungjuan420',
    href: socialLinks.soundcloud,
    icon: FaSoundcloud,
  },
];

const Contact = () => {
  const glowHandlers = {
    onMouseMove: updateCardGlow,
    onMouseLeave: resetCardGlow,
  };

  return (
    <div className="page contact-page">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="contact-hero"
      >
        <span className="eyebrow">Contact</span>
        <h1>Reach out if the project needs both taste and build quality.</h1>
        <p className="lead">
          The cleanest route is email. GitHub and SoundCloud are here too if you want
          the surrounding context.
        </p>
      </motion.section>

      <section className="bento-grid">
        {contactItems.map(({ label, detail, href, icon: Icon }, index) => (
          <motion.a
            key={label}
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.75,
              delay: 0.12 + index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="bento-card contact-card span-4"
            {...glowHandlers}
          >
            <span className="icon-wrap">
              <Icon size={20} />
            </span>
            <span className="eyebrow">{label}</span>
            <h2>{detail}</h2>
            <span className="inline-link">Open</span>
          </motion.a>
        ))}

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="bento-card ribbon-card tint-cloud span-12"
          {...glowHandlers}
        >
          <div className="card-stack">
            <span className="eyebrow">Working style</span>
            <h2>Thoughtful, direct, and detail-heavy where it counts.</h2>
            <p>
              I care about structure, rhythm, and reducing visual noise without
              flattening the personality out of the work.
            </p>
          </div>
        </motion.article>
      </section>
    </div>
  );
};

export default Contact;
