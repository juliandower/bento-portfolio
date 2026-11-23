import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import './App.css';
import { siteCopy } from './data/siteContent';
import { LocaleProvider, useLocale } from './locale';
import Contact from './pages/Contact';
import CV from './pages/CV';
import Home from './pages/Home';

const navItems = [
  { label: 'home', anchor: 'home' },
  { label: 'work', anchor: 'work-title' },
  { label: 'contact', anchor: 'contact-title' },
] as const;
const instantScroll = 'instant' as ScrollBehavior;

function SiteNav() {
  const { pathname, hash, key } = useLocation();
  const [homeSection, setHomeSection] = useState('home');
  const { locale, setLocale } = useLocale();
  const copy = siteCopy[locale];

  useLayoutEffect(() => {
    if (pathname !== '/') return;
    const work = document.getElementById('work-title');
    const contact = document.getElementById('contact-title');
    if (!work || !contact) return;

    // Keep the destination highlighted while an anchor scroll passes other sections.
    let destination = navItems.find(({ anchor }) => hash === `#${anchor}`)?.anchor;
    if (destination) setHomeSection(destination);

    let frame = 0;
    const updateSection = () => {
      const threshold = Math.min(240, window.innerHeight * .36);
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      const section = contact.getBoundingClientRect().top <= threshold || atBottom
        ? 'contact-title'
        : work.getBoundingClientRect().top <= threshold ? 'work-title' : 'home';
      if (!destination || destination === section) {
        destination = undefined;
        setHomeSection(section);
      }
      frame = 0;
    };
    function schedule() {
      if (!frame) frame = requestAnimationFrame(updateSection);
    }
    function followViewport() {
      destination = undefined;
      schedule();
    }

    updateSection();
    const timer = destination ? window.setTimeout(followViewport, 800) : undefined;
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('wheel', followViewport, { passive: true });
    window.addEventListener('touchmove', followViewport, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('wheel', followViewport);
      window.removeEventListener('touchmove', followViewport);
    };
  }, [pathname, hash, key]);

  const current = pathname === '/' ? homeSection : pathname === '/contact' ? 'contact-title' : '';
  const activeIndex = navItems.findIndex(({ anchor }) => anchor === current);

  return (
    <header className="site-header">
      <button
        type="button"
        className="locale-toggle"
        aria-label={copy.switchLocale}
        onClick={() => setLocale(locale === 'en' ? 'de' : 'en')}
      >
        <span aria-hidden="true" data-current={locale === 'en'}>EN</span>
        <span aria-hidden="true" data-current={locale === 'de'}>DE</span>
      </button>
      <nav className="site-nav" aria-label={copy.navigation}>
        <span
          className="nav-highlight"
          aria-hidden="true"
          style={{ transform: `translateX(${Math.max(0, activeIndex) * 100}%)`, opacity: Number(activeIndex >= 0) }}
        />
        {navItems.map(({ label, anchor }) => (
          <Link key={anchor} to={`/#${anchor}`} aria-current={current === anchor ? 'location' : undefined}>
            {copy[label]}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function Site() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef<string>();
  const { locale } = useLocale();

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
      <a className="skip-link" href="#main-content">{siteCopy[locale].skip}</a>
      <SiteNav />

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

export default function App() {
  return <LocaleProvider><Site /></LocaleProvider>;
}
