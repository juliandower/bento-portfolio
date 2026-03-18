export const updateCardGlow = (event) => {
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;

  event.currentTarget.style.setProperty('--glow-x', `${x}px`);
  event.currentTarget.style.setProperty('--glow-y', `${y}px`);
};

export const resetCardGlow = (event) => {
  event.currentTarget.style.removeProperty('--glow-x');
  event.currentTarget.style.removeProperty('--glow-y');
};
