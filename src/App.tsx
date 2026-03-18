import React from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { FaGithub, FaSoundcloud } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import './App.css';
import Contact from './pages/Contact';
import Home from './pages/Home';
import { socialLinks } from './data/siteContent';

const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'Contact', to: '/contact' },
];

const socialItems = [
  { label: 'Email', href: socialLinks.email, icon: MdEmail },
  { label: 'GitHub', href: socialLinks.github, icon: FaGithub },
  { label: 'SoundCloud', href: socialLinks.soundcloud, icon: FaSoundcloud },
];

function App() {
  return (
    <div className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <header className="site-header">
        <div className="site-header-inner">
          <NavLink to="/" className="brand-mark">
            Julian Dower
          </NavLink>

          <nav className="site-nav" aria-label="Primary">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `site-nav-link${isActive ? ' is-active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-socials" aria-label="Social links">
            {socialItems.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                aria-label={label}
                className="social-link"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </header>

      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Navigate to="/" replace />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <p>Software, music, and design arranged into one long, quieter bento field.</p>
      </footer>
    </div>
  );
}

export default App;
