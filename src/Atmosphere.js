import { useEffect, useRef, useState } from 'react';
import './Atmosphere.css';

// The shader draws a cloud volume with premultiplied alpha over the hero.
const vertexSource = `
  attribute vec2 position;
  void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragmentSource = `
  precision highp float;
  uniform vec2 resolution;
  uniform float time;
  uniform vec3 cloud;
  uniform vec3 clearance;
  uniform vec4 airflow[5];

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
  float ball(vec3 p, vec3 c, vec3 r) {
    return 1.0 - length((p-c)/r);
  }
  float density(vec3 p, float breeze) {
    // Build the bank from many overlapping, irregular small volumes. Each
    // tier protrudes above the one below, giving cumulus a scalloped outline.
    // Keep a cheap bound before the detailed volume work.
    if (p.x < -1.3 || p.x > 2.25 || p.y < -1.2 || p.y > 1.05 || p.z < 3.0 || p.z > 6.5) return 0.0;
    float shape = ball(p,vec3(.20,-.68,4.60),vec3(.66,.34,1.03));
    shape = max(shape,ball(p,vec3(.76,-.65,4.45),vec3(.70,.36,1.12)));
    shape = max(shape,ball(p,vec3(1.32,-.65,4.65),vec3(.72,.36,1.15)));
    shape = max(shape,ball(p,vec3(.05,-.43,4.08),vec3(.32,.31,.62)));
    shape = max(shape,ball(p,vec3(.35,-.35,4.05),vec3(.34,.38,.66)));
    shape = max(shape,ball(p,vec3(.67,-.37,4.02),vec3(.35,.32,.60)));
    shape = max(shape,ball(p,vec3(1.03,-.40,4.05),vec3(.39,.37,.66)));
    shape = max(shape,ball(p,vec3(1.38,-.40,4.17),vec3(.34,.32,.65)));
    shape = max(shape,ball(p,vec3(1.66,-.43,4.32),vec3(.30,.31,.64)));
    shape = max(shape,ball(p,vec3(.36,-.04,4.46),vec3(.28,.29,.52)));
    shape = max(shape,ball(p,vec3(.61,.01,4.36),vec3(.31,.34,.59)));
    shape = max(shape,ball(p,vec3(.87,-.02,4.34),vec3(.30,.29,.55)));
    shape = max(shape,ball(p,vec3(1.13,.00,4.45),vec3(.32,.34,.62)));
    shape = max(shape,ball(p,vec3(1.40,-.04,4.50),vec3(.30,.28,.54)));
    shape = max(shape,ball(p,vec3(1.62,-.12,4.52),vec3(.26,.27,.53)));
    shape = max(shape,ball(p,vec3(.62,.28,4.73),vec3(.24,.25,.48)));
    shape = max(shape,ball(p,vec3(.84,.29,4.68),vec3(.27,.31,.52)));
    shape = max(shape,ball(p,vec3(1.07,.30,4.76),vec3(.24,.25,.47)));
    shape = max(shape,ball(p,vec3(1.29,.22,4.72),vec3(.23,.24,.48)));
    shape = max(shape,ball(p,vec3(.86,.52,4.89),vec3(.21,.24,.42)));
    shape = max(shape,ball(p,vec3(1.03,.49,4.95),vec3(.20,.21,.43)));
    if (shape < -.32) return 0.0;
    // Erode the edges at two scales without wiping out their silhouette.
    vec3 q = p*6.4 + vec3(time*.038,time*.019,time*.012);
    float detail = fbm(q);
    float tiny = noise(p*13.0 + vec3(9.0,time*.012,1.0));
    float wisp = smoothstep(.20,.78,detail*.72 + tiny*.28);
    float opening = breeze * mix(.26,.92,wisp);
    float contour = shape + (detail-.54)*.85 + (tiny-.5)*.22 - opening*.36;
    return smoothstep(-.08,.15,contour) * (1.0-opening*.95);
  }
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float aspect = resolution.x / resolution.y;
    vec2 point = (uv-cloud.xy)*vec2(aspect,1.0)/cloud.z + vec2(.86,-.25);
    if (point.x < -.66 || point.x > 2.18 || point.y < -1.19 || point.y > .91) {
      gl_FragColor = vec4(0.0);
      return;
    }

    // The pointer breaks up local wisps. The cloud silhouette and sky stay
    // in their original coordinates instead of bending into a lens.
    float breeze = 0.0;
    for (int i=0; i<5; i++) {
      vec4 gust = airflow[i];
      vec2 delta = (uv-gust.xy)*vec2(aspect,1.0);
      float influence = exp(-dot(delta,delta)/max(.001,gust.w*gust.w));
      breeze = max(breeze,gust.z*influence);
    }

    vec3 accumulated = vec3(0.0);
    float opacity = 0.0;
    // Fixed-step ray march through a 3D density field. Low resolution and
    // early exit keep this viable on integrated GPUs and mobile devices.
    for (int i=0; i<24; i++) {
      float z = 2.75 + float(i)*.17;
      vec3 p = vec3(point.x,point.y,z);
      float d = density(p,breeze);
      if (d > .01) {
        // Sample toward the sun for soft self-shadowing. Higher lobes catch
        // more light; lower and occluded portions retain cool blue-gray depth.
        float lightD = density(p + vec3(-.13,.19,-.12),breeze);
        float shadow = clamp(lightD * .52, 0.0, .52);
        float fineLight = noise(p*9.0 + vec3(4.0, 7.0, 2.0));
        float light = clamp(.73 - shadow + (d-lightD)*.45 + point.y*.17 + (fineLight-.5)*.42, .18, 1.0);
        vec3 shade = mix(vec3(.30,.46,.60),vec3(1.0,.99,.97),light);
        shade = mix(shade,vec3(.70,.83,.90),clamp((z-4.0)*.09,0.0,.19));
        float a = d*mix(.23,.32,clearance.z)*(1.0-opacity);
        accumulated += shade*a;
        opacity += a;
      }
      if (opacity > .97) break;
    }
    float besideCopy = smoothstep(clearance.x,clearance.x+.13,uv.x);
    float belowCopy = 1.0-smoothstep(clearance.y-.085,clearance.y,uv.y);
    float cloudAmount = mix(max(besideCopy,belowCopy),1.0,clearance.z);
    gl_FragColor = vec4(accumulated,opacity)*cloudAmount;
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

function createRenderer(gl) {
  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
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
  const clearance = gl.getUniformLocation(program, 'clearance');
  const airflow = gl.getUniformLocation(program, 'airflow[0]');

  return {
    resize(width, height) {
      const { canvas } = gl;
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolution, width, height);
    },
    draw(seconds, geometry, passage, gusts) {
      const { windwardX, windwardY, restingX, restingY, scale, copyRight, copyBottom } = geometry;
      gl.uniform1f(time, seconds);
      gl.uniform3f(cloud, mix(restingX, windwardX, passage), mix(restingY, windwardY, passage), scale);
      gl.uniform3f(clearance, copyRight, copyBottom, ease(.08, .68, passage));
      gl.uniform4fv(airflow, gusts);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    dispose() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}

const clamp = (value) => Math.max(0, Math.min(1, value));
const mix = (from, to, progress) => from + (to - from) * progress;
const ease = (from, to, value) => {
  const t = clamp((value - from) / (to - from));
  return t * t * (3 - 2 * t);
};

function animateCloud(canvas, intro, renderer, opening) {
  const hero = canvas.closest('.hero');
  const preferences = [
    '(prefers-reduced-motion: reduce)',
    '(prefers-contrast: more)',
    '(forced-colors: active)',
  ].map(query => window.matchMedia(query));
  const staticCloud = () => preferences.some(preference => preference.matches);
  const flows = new Float32Array(20);
  const gusts = [];
  let pointer = null;
  let trailOrigin = null;
  let pointerStrength = 0;
  let frame = 0;
  let lastDraw = 0;
  let start = null;
  let visible = !document.hidden;
  let intersecting = true;
  let geometry;
  let scrollTarget;
  let scrollPassage;

  function onScroll() {
    if (!geometry) return;
    scrollTarget = ease(8, geometry.coverAt, window.scrollY - geometry.pageTop);
    if (pointer) {
      const position = positionInHero(pointer.clientX, pointer.clientY);
      if (position) Object.assign(pointer, position);
      else clearPointer();
      trailOrigin = null;
    }
  }

  function measure() {
    const { width, height, left, top } = hero.getBoundingClientRect();
    if (!width || !height) return;
    const copy = intro.getBoundingClientRect();
    const subtitle = intro.lastElementChild.getBoundingClientRect();
    const compact = width < 750;
    const cloudSize = compact ? Math.min(width * .62, height * .45) : Math.min(width * .40, height * .55);
    const pixelRatio = Math.min(compact ? .63 : .68, Math.sqrt(420000 / (width * height)));

    geometry = {
      width,
      height,
      left,
      pageTop: top + window.scrollY,
      coverAt: Math.max(120, Math.min(305, copy.top - top + copy.height * .14)),
      // Move the densest part of the cloud directly across the name and intro.
      windwardX: (copy.left - left + copy.width * .48) / width,
      windwardY: 1 - (copy.top - top + copy.height * .50) / height,
      restingX: compact ? .92 : Math.max(.75, (copy.right - left + cloudSize * .75) / width),
      restingY: compact ? .17 : .33,
      scale: cloudSize / height,
      copyRight: (copy.right - left + 14) / width,
      copyBottom: 1 - (subtitle.bottom - top + 10) / height,
    };

    renderer.resize(Math.max(1, Math.round(width * pixelRatio)), Math.max(1, Math.round(height * pixelRatio)));
    onScroll();
    if (scrollPassage === undefined) scrollPassage = scrollTarget;
    schedule();
  }

  function clearPointer() {
    pointer = null;
    trailOrigin = null;
  }

  function positionInHero(clientX, clientY) {
    const { left, pageTop, width, height } = geometry;
    const x = (clientX - left) / width;
    const y = 1 - (clientY + window.scrollY - pageTop) / height;
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

    const { x, y } = position;
    const { width, height } = geometry;
    const now = performance.now();
    const touch = event.pointerType === 'touch';
    pointer = { x, y, clientX, clientY, touch };
    if (!trailOrigin) trailOrigin = { x, y, time: now };
    const dx = (x - trailOrigin.x) * width;
    const dy = (y - trailOrigin.y) * height;
    const distance = Math.hypot(dx, dy);
    if (distance < 26 || now - trailOrigin.time < 48) return;

    gusts.unshift({
      x: trailOrigin.x,
      y: trailOrigin.y,
      dx: dx / distance * .08 * height / width,
      dy: dy / distance * .03 + .025,
      time: now,
      strength: touch ? .38 : .63,
    });
    gusts.length = Math.min(gusts.length, flows.length / 4 - 1);
    trailOrigin = { x, y, time: now };
  }

  function onPointerOut(event) {
    if (!event.relatedTarget) clearPointer();
  }

  function onPointerUp(event) {
    if (event.pointerType !== 'mouse') clearPointer();
  }

  function updateAirflow(now, dt) {
    const strength = pointer ? (pointer.touch ? .58 : .9) : 0;
    pointerStrength = mix(pointerStrength, strength, 1 - Math.exp(-dt * 9));
    // Preserve the last center during the short fade after the pointer leaves.
    if (pointer) flows.set([pointer.x, pointer.y, pointerStrength, .087]);
    else flows[2] = pointerStrength;

    flows.fill(0, 4);
    gusts.forEach((gust, index) => {
      const age = (now - gust.time) / 1000;
      const drift = 1 - Math.exp(-age * 1.8);
      const amount = gust.strength * Math.exp(-age * 2.9);
      flows.set([gust.x + gust.dx * drift, gust.y + gust.dy * drift, amount, .077 + .045 * drift], (index + 1) * 4);
    });
  }

  function schedule() {
    if (geometry && visible && intersecting && !frame) frame = requestAnimationFrame(draw);
  }

  function draw(now) {
    frame = 0;
    if (!visible || !intersecting) return;
    const resting = staticCloud();
    if (!resting && lastDraw && now - lastDraw < 30) {
      schedule();
      return;
    }

    if (start === null) start = now;
    const elapsed = (now - start) / 1000;
    const dt = lastDraw ? Math.min(.1, (now - lastDraw) / 1000) : 1 / 30;
    lastDraw = now;
    scrollPassage = mix(scrollPassage, scrollTarget, 1 - Math.exp(-dt * 12));
    const reveal = 1 - ease(.02, 1.18, elapsed);
    const passage = resting ? 0 : Math.max(scrollPassage, reveal);
    if (!resting) updateAirflow(now, dt);
    renderer.draw(resting ? 0 : elapsed, geometry, passage, flows);
    if (!resting) schedule();
  }

  function onPreferenceChange() {
    if (staticCloud()) {
      clearPointer();
      gusts.length = 0;
      pointerStrength = 0;
      flows.fill(0);
      // Let people who turn animation back on begin in the current scroll state.
      start = performance.now() - 1180;
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
    schedule();
  }

  const intersection = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(onIntersection) : null;
  const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
  intersection?.observe(hero);
  resize?.observe(hero);
  resize?.observe(intro);
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
  if (staticCloud() || !opening || scrollTarget > 0) start = performance.now() - 1180;

  return () => {
    cancelAnimationFrame(frame);
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

export default function Atmosphere({ introRef }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const intro = introRef.current;
    if (!canvas || !intro || !window.WebGLRenderingContext) return undefined;
    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
    if (!gl) return undefined;

    let stop;
    let opened = false;
    function start() {
      const renderer = createRenderer(gl);
      if (!renderer) return;
      const stopAnimation = animateCloud(canvas, intro, renderer, !opened);
      opened = true;
      stop = () => {
        stopAnimation();
        renderer.dispose();
      };
      setReady(true);
    }
    function loseContext(event) {
      event.preventDefault();
      stop?.();
      stop = undefined;
      setReady(false);
    }

    canvas.addEventListener('webglcontextlost', loseContext);
    canvas.addEventListener('webglcontextrestored', start);
    start();
    return () => {
      stop?.();
      canvas.removeEventListener('webglcontextlost', loseContext);
      canvas.removeEventListener('webglcontextrestored', start);
    };
  }, [introRef]);

  return (
    <>
      <div className="atmosphere-sky" aria-hidden="true" />
      <div className={ready ? 'atmosphere atmosphere--ready' : 'atmosphere'} aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
    </>
  );
}
