import { useEffect, useRef, useState } from 'react';
import { cloudLobeCount } from './cloudPhysics';
import { createCloudScene, ease } from './cloudScene';
import './Atmosphere.css';

// The shader draws a cloud volume with premultiplied alpha over the hero.
const vertexSource = `
  attribute vec2 position;
  void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragmentSource = (steps, stepSize) => `
  precision highp float;
  uniform vec2 resolution;
  uniform float time;
  uniform vec4 cloud;
  uniform vec4 cloudStyle;
  uniform vec3 centers[${cloudLobeCount}];
  uniform vec3 inverseRadii[${cloudLobeCount}];

  float hash(vec3 p) {
    p = fract(p * .1031);
    p += dot(p, p.yxz + 33.33);
    return fract((p.x + p.y) * p.z);
  }
  float noise(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),
                   mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                   mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
  }
  float fbm(vec3 p) {
    float n = .57 * noise(p);
    p = p * 2.03 + 13.1;
    n += .28 * noise(p);
    p = p * 2.01 + 7.7;
    n += .15 * noise(p);
    return n;
  }
  float shape(vec3 p) {
    // Let overlapping lobes contribute to one density field. The strongest
    // lobe defines the contour, with a bounded boost where several meet.
    float strongest = 0.0;
    float total = 0.0;
    for (int i = 0; i < ${cloudLobeCount}; i++) {
      vec3 local = (p - centers[i]) * inverseRadii[i];
      float weight = max(0.0, 1.0 - dot(local, local) * .72);
      strongest = max(strongest, weight);
      total += weight;
    }
    if (strongest < .08) return 0.0;
    return strongest + min(.16, (total - strongest) * .13);
  }
  float density(vec3 p) {
    float body = shape(p);
    if (body == 0.0) return 0.0;
    // Advect fine detail slowly through the field while the lobes do the
    // larger movement. Erosion leaves translucent wisps along the edge.
    float detail = fbm(p * vec3(7.1, 6.2, 6.4) + vec3(time * .10 + cloudStyle.w * 9.7, time * .046, 0.0));
    return smoothstep(.22, .85, body + (detail - .50) * .74);
  }
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 point = (uv - cloud.xy) / cloud.zw;
    vec3 accumulated = vec3(0.0);
    float opacity = 0.0;
    const float stepSize = ${stepSize.toFixed(5)};
    // Stagger the samples to avoid bands on the billows as they move.
    float offset = hash(vec3(gl_FragCoord.xy, 3.0)) * stepSize;
    for (int i = 0; i < ${steps}; i++) {
      float z = 2.64 + offset + float(i) * stepSize;
      vec3 p = vec3(point, z);
      float d = density(p);
      if (d > .01) {
        // Look up toward the sun. Exposed lobes catch warm light while
        // overlapping volumes keep softer, cool shadows.
        float towardSun = smoothstep(.24, .93, shape(p + vec3(-.25, .31, -.30)));
        float transmission = exp(-towardSun * 1.95);
        float light = clamp(.27 + transmission * .66 + point.y * .10 + (d - towardSun) * .21, .23, 1.0);
        vec3 shade = mix(vec3(.40, .56, .72), vec3(1.0, .989, .961), light);
        shade = mix(shade, vec3(.52, .70, .84), cloudStyle.z * .56);
        float a = (1.0 - exp(-d * stepSize * cloudStyle.y)) * (1.0 - opacity);
        accumulated += shade * a;
        opacity += a;
      }
      if (opacity > .995) {
        accumulated /= opacity;
        opacity = 1.0;
        break;
      }
    }
    gl_FragColor = vec4(accumulated, opacity) * cloudStyle.x;
  }
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function cloudBounds({ centers, inverseRadii }, { x, y, scaleX, scaleY }, width, height) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  // Round up the radius where shape() stops contributing to the ray.
  const support = 1.14;

  for (let i = 0; i < centers.length; i += 3) {
    const radiusX = support / inverseRadii[i];
    const radiusY = support / inverseRadii[i + 1];
    minX = Math.min(minX, centers[i] - radiusX);
    maxX = Math.max(maxX, centers[i] + radiusX);
    minY = Math.min(minY, centers[i + 1] - radiusY);
    maxY = Math.max(maxY, centers[i + 1] + radiusY);
  }

  return {
    left: Math.max(0, Math.floor((x + minX * scaleX) * width)),
    right: Math.min(width, Math.ceil((x + maxX * scaleX) * width)),
    bottom: Math.max(0, Math.floor((y + minY * scaleY) * height)),
    top: Math.min(height, Math.ceil((y + maxY * scaleY) * height)),
  };
}

function createRenderer(gl, steps) {
  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource(steps, 3.95 / steps));
  if (!vertex || !fragment) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    return null;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const resolution = gl.getUniformLocation(program, 'resolution');
  const time = gl.getUniformLocation(program, 'time');
  const cloud = gl.getUniformLocation(program, 'cloud');
  const cloudStyle = gl.getUniformLocation(program, 'cloudStyle');
  const centers = gl.getUniformLocation(program, 'centers[0]');
  const inverseRadii = gl.getUniformLocation(program, 'inverseRadii[0]');
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  return {
    resize(width, height) {
      const { canvas } = gl;
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolution, width, height);
    },
    draw(seconds, banks) {
      const { width, height } = gl.canvas;
      gl.disable(gl.SCISSOR_TEST);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.SCISSOR_TEST);
      gl.uniform1f(time, seconds);
      banks.forEach(({ footprint, physics, alpha, density, haze, seed }) => {
        if (alpha < .005) return;
        const { x, y, scaleX, scaleY } = footprint;
        const { left, right, bottom, top } = cloudBounds(physics, footprint, width, height);
        if (right <= left || top <= bottom) return;

        gl.scissor(left, bottom, right - left, top - bottom);
        gl.uniform4f(cloud, x, y, scaleX, scaleY);
        gl.uniform4f(cloudStyle, alpha, density, haze, seed);
        gl.uniform3fv(centers, physics.centers);
        gl.uniform3fv(inverseRadii, physics.inverseRadii);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      });
    },
    dispose() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}

const clamp = (value) => Math.max(0, Math.min(1, value));

function animateCloud(canvas, title, rear, front) {
  const hero = canvas.closest('.hero');
  const stage = hero.parentElement;
  const preferences = [
    '(prefers-reduced-motion: reduce)',
    '(prefers-contrast: more)',
    '(forced-colors: active)',
  ].map(query => window.matchMedia(query));
  const staticCloud = () => preferences.some(preference => preference.matches);
  const scene = createCloudScene();
  let pointer = null;
  let frame = 0;
  let lastDraw = 0;
  let cloudTime = 0;
  let lastNameVisibility;
  let lastCloudCover;
  let visible = !document.hidden;
  let intersecting = true;
  let geometry;
  let scrollTarget;
  let scrollPassage;

  function onScroll() {
    if (!intersecting || !geometry) return;
    scrollTarget = clamp((window.scrollY - geometry.pageTop) / geometry.travel);
    if (pointer) {
      const position = positionInHero(pointer.clientX, pointer.clientY);
      if (position) Object.assign(pointer, position);
      else clearPointer();
    }
  }

  function measure() {
    const { width, height, left, top } = hero.getBoundingClientRect();
    if (!width || !height) return;
    const name = title.getBoundingClientRect();
    const section = stage.getBoundingClientRect();

    geometry = {
      width,
      height,
      left,
      pageTop: section.top + window.scrollY,
      travel: Math.max(1, section.height - height),
      compact: width <= 750,
      title: {
        x: (name.left - left) / width,
        y: 1 - (name.top - top) / height,
        width: name.width / width,
        height: name.height / height,
      },
    };

    const resizeLayer = (renderer, budget, limit) => {
      const ratio = Math.min(limit, Math.sqrt(budget / (width * height)));
      renderer.resize(Math.max(1, Math.round(width * ratio)), Math.max(1, Math.round(height * ratio)));
    };
    resizeLayer(rear, 120000, .46);
    resizeLayer(front, 140000, .56);
    onScroll();
    if (scrollPassage === undefined) scrollPassage = scrollTarget;
    schedule();
  }

  function clearPointer() {
    pointer = null;
  }

  function positionInHero(clientX, clientY) {
    const { left, width, height } = geometry;
    const { top } = hero.getBoundingClientRect();
    const x = (clientX - left) / width;
    const y = 1 - (clientY - top) / height;
    return x < 0 || x > 1 || y < 0 || y > 1 ? null : { x, y };
  }

  function onPointer(event) {
    if (!geometry || event.isPrimary === false || !intersecting || staticCloud()) return;
    if (event.pointerType === 'touch' && event.type === 'pointermove' && !pointer) return;
    const { clientX, clientY } = event;
    const position = positionInHero(clientX, clientY);
    if (!position) {
      clearPointer();
      return;
    }

    pointer = { ...position, clientX, clientY, touch: event.pointerType === 'touch' };
  }

  function onPointerOut(event) {
    if (!event.relatedTarget) clearPointer();
  }

  function onPointerUp(event) {
    if (event.pointerType !== 'mouse') clearPointer();
  }

  function schedule() {
    if (geometry && visible && intersecting && !frame) frame = requestAnimationFrame(draw);
  }

  function draw(now) {
    frame = 0;
    if (!visible || !intersecting) return;
    const still = staticCloud();
    if (!still && lastDraw && now - lastDraw < 30) {
      schedule();
      return;
    }

    const elapsed = lastDraw ? (now - lastDraw) / 1000 : 1 / 30;
    const dt = Math.min(.05, elapsed);
    lastDraw = now;
    scrollPassage += (scrollTarget - scrollPassage) * (1 - Math.exp(-elapsed * 6));
    const passage = still ? 0 : scrollPassage;
    if (!still) cloudTime += dt;
    const seconds = still ? 0 : cloudTime;
    scene.update(seconds, dt, pointer, geometry, passage, still);
    // Close the last gaps left by wisps when the front bank reaches the name.
    const nameVisibility = Math.round((1 - ease(.66, .83, passage)) * 100) / 100;
    if (nameVisibility !== lastNameVisibility) {
      title.style.setProperty('--name-visibility', nameVisibility);
      lastNameVisibility = nameVisibility;
    }
    const cloudCover = Math.round(passage * 100) / 100;
    if (cloudCover !== lastCloudCover) {
      hero.style.setProperty('--cloud-cover', cloudCover);
      lastCloudCover = cloudCover;
    }
    rear.draw(seconds, scene.rear);
    front.draw(seconds, scene.front);
    if (!still) schedule();
  }

  function onPreferenceChange() {
    if (staticCloud()) {
      clearPointer();
      scene.reset();
    }
    lastDraw = 0;
    schedule();
  }

  function onVisibilityChange() {
    visible = !document.hidden;
    if (!visible) clearPointer();
    schedule();
  }

  function onIntersection(entries) {
    intersecting = entries[0].isIntersecting;
    if (!intersecting) clearPointer();
    else onScroll();
    schedule();
  }

  const intersection = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(onIntersection) : null;
  const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
  intersection?.observe(hero);
  resize?.observe(stage);
  resize?.observe(hero);
  resize?.observe(title);
  window.addEventListener('resize', measure);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('pointerdown', onPointer, { passive: true });
  window.addEventListener('pointerout', onPointerOut);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', clearPointer);
  window.addEventListener('blur', clearPointer);
  document.addEventListener('visibilitychange', onVisibilityChange);
  preferences.forEach(preference => preference.addEventListener('change', onPreferenceChange));
  measure();

  return () => {
    cancelAnimationFrame(frame);
    title.style.removeProperty('--name-visibility');
    hero.style.removeProperty('--cloud-cover');
    intersection?.disconnect();
    resize?.disconnect();
    window.removeEventListener('resize', measure);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('pointermove', onPointer);
    window.removeEventListener('pointerdown', onPointer);
    window.removeEventListener('pointerout', onPointerOut);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', clearPointer);
    window.removeEventListener('blur', clearPointer);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    preferences.forEach(preference => preference.removeEventListener('change', onPreferenceChange));
  };
}

export default function Atmosphere({ titleRef }) {
  const rearRef = useRef(null);
  const frontRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvases = [rearRef.current, frontRef.current];
    const title = titleRef.current;
    if (canvases.some(canvas => !canvas) || !title || !window.WebGLRenderingContext) return undefined;
    const contexts = canvases.map(canvas => canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      powerPreference: 'low-power',
    }));
    if (contexts.some(gl => !gl)) return undefined;

    let stop;
    function start() {
      if (stop || contexts.some(gl => gl.isContextLost())) return;
      const rear = createRenderer(contexts[0], 13);
      const front = createRenderer(contexts[1], 20);
      if (!rear || !front) {
        rear?.dispose();
        front?.dispose();
        return;
      }
      const stopAnimation = animateCloud(canvases[0], title, rear, front);
      stop = () => {
        stopAnimation();
        rear.dispose();
        front.dispose();
      };
      setReady(true);
    }
    function loseContext(event) {
      event.preventDefault();
      stop?.();
      stop = undefined;
      setReady(false);
    }

    canvases.forEach(canvas => {
      canvas.addEventListener('webglcontextlost', loseContext);
      canvas.addEventListener('webglcontextrestored', start);
    });
    start();
    return () => {
      stop?.();
      canvases.forEach(canvas => {
        canvas.removeEventListener('webglcontextlost', loseContext);
        canvas.removeEventListener('webglcontextrestored', start);
      });
    };
  }, [titleRef]);

  return (
    <>
      <div className="atmosphere-sky" aria-hidden="true" />
      <div className={ready ? 'atmosphere atmosphere--rear atmosphere--ready' : 'atmosphere atmosphere--rear'} aria-hidden="true">
        <canvas ref={rearRef} />
      </div>
      <div className={ready ? 'atmosphere atmosphere--front atmosphere--ready' : 'atmosphere atmosphere--front'} aria-hidden="true">
        <canvas ref={frontRef} />
      </div>
    </>
  );
}
