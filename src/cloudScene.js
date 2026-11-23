import { createCloudPhysics } from './cloudPhysics';

// Successive banks enter from the right, with each interval keyed to scroll.
// Sky coordinates start at the lower left.
const distantBanks = [
  { wide: [.20, .89, .23, .114], narrow: [.10, .93, .34, .088], arrival: [.08, .77], opacity: .81, haze: .41 },
  { wide: [.81, .75, .20, .159], narrow: [.94, .79, .35, .116], arrival: [0, .68], initial: [1.01, .86], opacity: .98, haze: .08 },
  { wide: [.95, .43, .18, .128], narrow: [.96, .47, .31, .104], arrival: [.16, .85], opacity: .91, haze: .23 },
  { wide: [.21, .04, .25, .123], narrow: [.12, .05, .46, .117], arrival: [.19, .91], opacity: .87, haze: .36 },
  { wide: [.64, .18, .25, .167], narrow: [.72, .21, .41, .150], arrival: [0, .79], initial: [1.02, .82], opacity: .97, haze: .13 },
];

// Near clouds are placed relative to the heading, with y measured down.
const nearBanks = [
  { settled: [1.25, .95, .79, .51], arrival: [.02, .75], opacity: .93, extinction: 7.4, haze: .24 },
  { settled: [.48, .49, .87, .87], arrival: [.12, .82], opacity: 1, extinction: 13, haze: .04 },
];

const mix = (from, to, progress) => from + (to - from) * progress;
export const ease = (start, end, value) => {
  const progress = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return progress * progress * (3 - 2 * progress);
};

function placeBank(bank, seconds, sky, x, y, scaleX, scaleY) {
  const progress = ease(...bank.arrival, sky);
  const [entryX, initialAlpha] = bank.initial ?? [1 + scaleX * 1.85, 0];
  const drift = .28 + .72 * progress;
  Object.assign(bank.footprint, {
    x: mix(entryX, x, progress) + Math.sin(seconds * .14 + bank.seed) * scaleX * .15 * drift,
    y: y + Math.sin(seconds * .19 + bank.seed * 1.7) * scaleY * .14 * drift,
    scaleX,
    scaleY,
  });
  bank.alpha = mix(initialAlpha, bank.opacity, progress);
  return progress;
}

export function createCloudScene() {
  function makeBank(layout, index, foreground) {
    const seed = index + (foreground ? distantBanks.length : 0);
    const physics = createCloudPhysics(seed, foreground ? .82 : .86);
    physics.reset();
    return { ...layout, seed, physics, footprint: {} };
  }

  const rear = distantBanks.map((layout, index) => makeBank(layout, index, false));
  const front = nearBanks.map((layout, index) => makeBank(layout, index, true));
  const banks = [...rear, ...front];

  return {
    rear,
    front,
    reset() {
      banks.forEach(({ physics }) => physics.reset());
    },
    update(seconds, dt, pointer, geometry, sky, still) {
      const { compact, title } = geometry;
      rear.forEach((bank) => {
        const [x, y, scaleX, scaleY] = compact ? bank.narrow : bank.wide;
        const arrival = placeBank(bank, seconds, sky, x, y, scaleX, scaleY);
        bank.density = mix(5.4, 6.6, arrival);
      });

      front.forEach((bank) => {
        const [x, y, width, height] = bank.settled;
        const arrival = placeBank(bank, seconds, sky,
          title.x + title.width * x, title.y - title.height * y, title.width * width, title.height * height);
        bank.density = mix(4.8, bank.extinction, arrival);
      });

      if (!still) banks.forEach(bank => {
        if (bank.alpha > .005) bank.physics.step(seconds, dt, pointer, bank.footprint, geometry);
      });
    },
  };
}
