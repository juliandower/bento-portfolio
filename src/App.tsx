import React from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Contact from './pages/Contact';
import Home from './pages/Home';

function App() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <NavLink to="/" className="brand-mark" aria-label="Julian Dower — Home">
          <span className="brand-symbol" aria-hidden="true"><i /><i /></span>
          Julian Dower
        </NavLink>
        <nav className="site-nav" aria-label="Primary navigation">
          <NavLink to="/" end>Work</NavLink>
          <a href="/#about-title">About</a>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </header>

      <main id="main-content">
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
