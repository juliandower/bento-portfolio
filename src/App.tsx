import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import './App.css';
import Contact from './pages/Contact';
import CV from './pages/CV';
import Home from './pages/Home';

const navItems = [
  { label: 'Home', anchor: 'home' },
  { label: 'Work', anchor: 'work-title' },
  { label: 'Contact', anchor: 'contact-title' },
];
const instantScroll = 'instant' as ScrollBehavior;

function SiteNav({ pathname }: { pathname: string }) {
  const [homeSection, setHomeSection] = useState('home');

  useEffect(() => {
    if (pathname !== '/') return;
    const work = document.getElementById('work-title');
    const contact = document.getElementById('contact-title');
    if (!work || !contact) return;
    let frame = 0;
    const updateSection = () => {
      const threshold = Math.min(240, window.innerHeight * .36);
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      if (contact.getBoundingClientRect().top <= threshold || atBottom) {
        setHomeSection('contact-title');
      } else {
        setHomeSection(work.getBoundingClientRect().top <= threshold ? 'work-title' : 'home');
      }
      frame = 0;
    };
    function schedule() {
      if (!frame) frame = requestAnimationFrame(updateSection);
    }
    updateSection();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname]);

  const current = pathname === '/' ? homeSection : pathname === '/contact' ? 'contact-title' : '';

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        {navItems.map(({ label, anchor }) => (
          <Link key={anchor} to={`/#${anchor}`} aria-current={current === anchor ? 'location' : undefined}>
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function App() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef<string>();

  useLayoutEffect(() => {
    const samePage = previousPath.current === location.pathname;
    previousPath.current = location.pathname;
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ behavior: samePage && navigationType !== 'POP' ? 'auto' : instantScroll });
    } else if (navigationType !== 'POP' && window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: instantScroll });
    }
  }, [location, navigationType]);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteNav pathname={location.pathname} />

      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Navigate to="/" replace />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
