import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { socialLinks } from '../data/siteContent';

const contactItems = [
  { label: 'Email', detail: 'dower.julian@gmail.com', href: socialLinks.email },
  { label: 'GitHub', detail: 'github.com/juliandower', href: socialLinks.github },
  { label: 'SoundCloud', detail: 'soundcloud.com/yungjuan420', href: socialLinks.soundcloud },
];

const Contact = () => {
  return (
    <div className="contact-page">
      <section className="contact-intro">
        <h1>Let’s talk<span>.</span></h1>
        <p>For roles, projects or collaborations, email is the best place to start.</p>
        <div className="contact-sun" aria-hidden="true" />
      </section>

      <section className="contact-routes" aria-label="Ways to get in touch">
        {contactItems.map(({ label, detail, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            className="contact-route"
          >
            <span>{label}</span>
            <strong>{detail}</strong>
            <FaArrowRight aria-hidden="true" />
          </a>
        ))}
      </section>

      <footer className="contact-footer">
        <span>© {new Date().getFullYear()} Julian Dower</span>
      </footer>
    </div>
  );
};

export default Contact;
