import { createCloudPhysics } from './cloudPhysics';

// Successive banks enter from the right, with each interval keyed to scroll.
// Sky coordinates start at the lower left.
const distantBanks = [
  { wide: [.12, .89, .18, .110], narrow: [.10, .93, .29, .083], arrival: [.05, .69], opacity: .84, haze: .36 },
  { wide: [.36, .52, .20, .133], narrow: [.38, .56, .40, .117], arrival: [.18, .86], opacity: .83, haze: .34 },
  { wide: [.67, .86, .193, .137], narrow: [.66, .81, .33, .108], arrival: [0, .67], initial: [1.02, .32], opacity: .98, haze: .12 },
  { wide: [.94, .56, .16, .118], narrow: [.96, .51, .30, .095], arrival: [.26, .83], opacity: .92, haze: .21 },
  { wide: [.16, .035, .23, .106], narrow: [.10, .035, .40, .112], arrival: [.27, .96], opacity: .90, haze: .33 },
  { wide: [.64, .20, .24, .151], narrow: [.67, .23, .40, .146], arrival: [0, .81], initial: [1.12, .40], opacity: .98, haze: .10 },
  { wide: [.07, .38, .15, .113], narrow: [.03, .35, .27, .098], arrival: [.33, 1], opacity: .73, haze: .45 },
  { wide: [.40, .74, .15, .088], narrow: [.25, .77, .33, .084], arrival: [.40, .98], opacity: .76, haze: .29 },
];

// Near clouds are placed relative to the heading, with y measured down.
const nearBanks = [
  { settled: [.31, .34, .39, .33], arrival: [.28, .97], opacity: .78, haze: .23 },
  { settled: [1.00, .83, .47, .35], arrival: [.14, .84], opacity: .76, haze: .08 },
];

const mix = (from, to, progress) => from + (to - from) * progress;
const ease = (start, end, value) => {
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
    const physics = createCloudPhysics(seed, foreground ? 1.04 : .86);
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
        bank.extinction = mix(3.1, 4.8, arrival);
      });

      let nameLight = 0;
      front.forEach((bank) => {
        const [x, y, width, height] = bank.settled;
        const scaleX = title.width * width;
        const arrival = placeBank(bank, seconds, sky,
          title.x + title.width * x, title.y - title.height * y, scaleX, title.height * height);
        bank.extinction = mix(2.8, 5.5, arrival);

        // Nearby mist lends a soft blue bounce to the text as the banks part.
        const cloudCenter = bank.footprint.x + bank.physics.centers[0] * scaleX;
        const distance = Math.abs(cloudCenter - (title.x + title.width * .57)) / title.width;
        nameLight = Math.max(nameLight, Math.max(0, 1 - distance) * bank.alpha);
      });

      if (!still) banks.forEach(bank => {
        if (bank.alpha > .005) bank.physics.step(seconds, dt, pointer, bank.footprint, geometry);
      });
      return Math.round(nameLight * 68) / 100;
    },
  };
}
