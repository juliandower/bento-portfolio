import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { siteCopy, socialLinks } from '../data/siteContent';
import ContactOrb from '../ContactOrb';
import { useLocale } from '../locale';

const contactItems = [
  { detail: 'dower.julian@gmail.com', href: socialLinks.email },
  { label: 'GitHub', detail: 'github.com/juliandower', href: socialLinks.github },
  { label: 'LinkedIn', detail: 'Julian Dower', href: socialLinks.linkedin },
  { label: 'SoundCloud', detail: 'soundcloud.com/yungjuan420', href: socialLinks.soundcloud },
];

const Contact = () => {
  const { locale } = useLocale();
  const copy = siteCopy[locale];

  return (
    <div className="contact-page">
      <section className="contact-intro">
        <ContactOrb className="contact-sun" />
        <h1 id="contact-page-title">{copy.contact}</h1>
      </section>

      <section className="contact-routes" aria-labelledby="contact-page-title">
        {contactItems.map(({ label, detail, href }) => (
          <a
            key={href}
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            className="contact-route"
          >
            <span>{label ?? copy.email}</span>
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
