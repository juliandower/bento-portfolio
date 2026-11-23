import { useEffect, useRef } from 'react';

function scrollOrb(orb, area, distance, reducedMotion) {
  const viewport = window.visualViewport;
  const observer = typeof IntersectionObserver === 'function'
    ? new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    })
    : null;
  let visible = !observer;
  let frame = 0;

  function draw() {
    frame = 0;
    if (!visible || reducedMotion.matches) return;
    const { top, height } = area.getBoundingClientRect();
    const viewportHeight = viewport?.height ?? window.innerHeight;
    const offsetTop = viewport?.offsetTop ?? 0;
    const progress = (viewportHeight + offsetTop - top) / (viewportHeight + height);
    const position = Math.min(1, Math.max(0, progress)) - .5;
    orb.style.setProperty('--orb-scroll-y', `${(position * distance).toFixed(1)}px`);
  }

  function schedule() {
    if (visible && !frame && !reducedMotion.matches) frame = requestAnimationFrame(draw);
  }

  function reset() {
    cancelAnimationFrame(frame);
    frame = 0;
    orb.style.removeProperty('--orb-scroll-y');
  }

  function preferenceChanged() {
    if (reducedMotion.matches) reset();
    else schedule();
  }

  observer?.observe(area);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  viewport?.addEventListener('resize', schedule);
  viewport?.addEventListener('scroll', schedule, { passive: true });
  reducedMotion.addEventListener('change', preferenceChanged);
  schedule();

  return () => {
    observer?.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    viewport?.removeEventListener('resize', schedule);
    viewport?.removeEventListener('scroll', schedule);
    reducedMotion.removeEventListener('change', preferenceChanged);
    reset();
  };
}

export default function ContactOrb({ className, distance = 12, scrollDistance = 0 }) {
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
    const stopScroll = scrollDistance ? scrollOrb(orb, area, scrollDistance, reducedMotion) : null;
    return () => {
      stopScroll?.();
      area.removeEventListener('pointermove', move);
      area.removeEventListener('pointerleave', reset);
      window.removeEventListener('blur', reset);
      reducedMotion.removeEventListener('change', reset);
      reset();
    };
  }, [distance, scrollDistance]);

  return <div ref={orbRef} className={`contact-orb ${className}`} aria-hidden="true" />;
}
