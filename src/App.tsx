import React from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Contact from './pages/Contact';
import Home from './pages/Home';

function App() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <NavLink to="/" className="brand-mark" aria-label="Julian Dower — Home">
          <span className="brand-pulse" aria-hidden="true" />
          JD / SIGNAL STUDIO
        </NavLink>
        <nav className="site-nav" aria-label="Primary navigation">
          <NavLink to="/" end>Work</NavLink>
          <a href="/#about-title">About</a>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <span className="header-status"><i aria-hidden="true" /> Available for the right project</span>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Navigate to="/" replace />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
