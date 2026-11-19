// Each lobe has a rest position, three radii and a tether strength.
const lobes = [
  { center: [0, -.10, 4.5], radii: [1.34, 1.02, 1.15], tether: 6 },
  { center: [-.80, -.32, 4.6], radii: [.68, .56, .84], tether: 3.2 },
  { center: [.82, -.28, 4.7], radii: [.78, .64, .87], tether: 3.2 },
  { center: [-1.23, -.25, 4.5], radii: [.49, .42, .68], tether: 2.8 },
  { center: [1.25, -.14, 4.7], radii: [.54, .47, .67], tether: 2.8 },
  { center: [-.83, .20, 4.5], radii: [.56, .56, .69], tether: 3.2 },
  { center: [.87, .35, 4.7], radii: [.55, .61, .75], tether: 3.2 },
  { center: [-.53, .62, 4.7], radii: [.51, .62, .71], tether: 3.0 },
  { center: [.08, .78, 4.8], radii: [.59, .70, .81], tether: 3.2 },
  { center: [.60, .73, 4.85], radii: [.48, .55, .68], tether: 3.0 },
  { center: [-.50, -.75, 4.7], radii: [.64, .43, .71], tether: 3.0 },
  { center: [.36, -.76, 4.8], radii: [.75, .47, .79], tether: 3.0 },
  // Smaller front lobes catch the light and move over the shaded interior.
  { center: [-.62, -.21, 3.82], radii: [.48, .45, .56], tether: 3.2 },
  { center: [.06, -.35, 3.80], radii: [.53, .48, .56], tether: 3.4 },
  { center: [.64, -.20, 3.94], radii: [.53, .49, .60], tether: 3.2 },
  { center: [-.30, .33, 3.88], radii: [.48, .49, .58], tether: 3.4 },
  { center: [.30, .44, 4.02], radii: [.50, .57, .60], tether: 3.4 },
];

export const cloudLobeCount = lobes.length;

export function createCloudPhysics(seed, response) {
  const inverseRadii = new Float32Array(cloudLobeCount * 3);
  const particles = lobes.map(({ center, radii, tether }, index) => {
    const phase = index * 2.39996 + seed * 3.7;
    // Give each bank a distinct silhouette, even though they share a shader.
    const rest = [
      center[0] + Math.sin(phase * 1.9) * .17,
      center[1] + Math.cos(phase * 1.6) * .24,
      center[2] + Math.sin(phase * 2.1) * .18,
    ];
    radii.forEach((radius, axis) => {
      inverseRadii[index * 3 + axis] = 1 / (radius * (1 + Math.cos(phase + axis * 2.3) * .16));
    });
    return {
      rest,
      position: [...rest],
      velocity: [0, 0, 0],
      force: [0, 0, 0],
      tether,
      phase,
    };
  });
  const bonds = [];
  particles.forEach((a, index) => {
    for (let i = index + 1; i < particles.length; i++) {
      const b = particles[i];
      const distance = Math.hypot(...a.rest.map((axis, j) => axis - b.rest[j]));
      // Link immediate neighbors. Compressed bonds push back so the field
      // keeps its volume, and stretched bonds pull the lobes together.
      if (distance < .91) bonds.push({ a, b, distance });
    }
  });

  const centers = new Float32Array(cloudLobeCount * 3);

  return {
    centers,
    inverseRadii,
    reset() {
      particles.forEach(({ position, rest, velocity }, index) => {
        rest.forEach((value, axis) => { position[axis] = value; });
        velocity.fill(0);
        centers.set(rest, index * 3);
      });
    },
    step(seconds, dt, pointer, footprint, { width, height }) {
      const { x, y, scaleX, scaleY } = footprint;
      const unitX = scaleX * width;
      const unitY = scaleY * height;
      const reach = Math.max(118, Math.min(215, 88 + Math.sqrt(unitX * unitY) * .62));
      const damping = Math.exp(-dt * 3.5);

      const pointerX = pointer ? (x - pointer.x) * width : 0;
      const pointerY = pointer ? (y - pointer.y) * height : 0;
      const pointerStrength = (pointer?.touch ? 5 : 9) * response;
      particles.forEach(({ position, rest, force, tether, phase }) => {
        force[0] = (rest[0] - position[0]) * tether + Math.sin(seconds * .71 + phase) * .18;
        force[1] = (rest[1] - position[1]) * tether + Math.cos(seconds * .54 + phase) * .24;
        force[2] = (rest[2] - position[2]) * tether + Math.sin(seconds * .39 + phase) * .19;
        if (!pointer) return;

        const dx = pointerX + position[0] * unitX;
        const dy = pointerY + position[1] * unitY;
        const distance = Math.hypot(dx, dy);
        const falloff = Math.max(0, 1 - (distance / reach) ** 2);
        const pressure = pointerStrength * falloff ** 2 / (distance + 16);
        force[0] += dx * pressure;
        force[1] += dy * pressure;
        force[2] += (rest[2] - 4.6) * pressure * 9;
      });

      bonds.forEach(({ a, b, distance }) => {
        const dx = b.position[0] - a.position[0];
        const dy = b.position[1] - a.position[1];
        const dz = b.position[2] - a.position[2];
        const length = Math.hypot(dx, dy, dz);
        const pull = 1.9 * (length - distance) / Math.max(.001, length);
        a.force[0] += dx * pull;
        a.force[1] += dy * pull;
        a.force[2] += dz * pull;
        b.force[0] -= dx * pull;
        b.force[1] -= dy * pull;
        b.force[2] -= dz * pull;
      });

      particles.forEach(({ position, velocity, force }, index) => {
        for (let axis = 0; axis < 3; axis++) {
          velocity[axis] = (velocity[axis] + force[axis] * dt) * damping;
          position[axis] += velocity[axis] * dt;
        }
        centers.set(position, index * 3);
      });
    },
  };
}
