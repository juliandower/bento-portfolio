import { useEffect, useRef } from 'react';

export default function ContactOrb({ className, distance = 12 }) {
  const orbRef = useRef(null);

  useEffect(() => {
    const orb = orbRef.current;
    const area = orb.closest('.contact-page, .contact-cta');
    if (!area || !window.matchMedia) return undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function reset() {
      orb.style.removeProperty('--orb-x');
      orb.style.removeProperty('--orb-y');
    }

    function move(event) {
      if (reducedMotion.matches || event.pointerType === 'touch') return;
      const horizontal = (event.clientX / window.innerWidth) * 2 - 1;
      const vertical = (event.clientY / window.innerHeight) * 2 - 1;
      orb.style.setProperty('--orb-x', `${(horizontal * distance).toFixed(1)}px`);
      orb.style.setProperty('--orb-y', `${(vertical * distance * .67).toFixed(1)}px`);
    }

    area.addEventListener('pointermove', move, { passive: true });
    area.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
    reducedMotion.addEventListener('change', reset);
    return () => {
      area.removeEventListener('pointermove', move);
      area.removeEventListener('pointerleave', reset);
      window.removeEventListener('blur', reset);
      reducedMotion.removeEventListener('change', reset);
    };
  }, [distance]);

  return <div ref={orbRef} className={`contact-orb ${className}`} aria-hidden="true" />;
}
