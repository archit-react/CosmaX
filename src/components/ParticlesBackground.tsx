import { useEffect } from "react";

type PJSVendors = { destroypJS?: () => void };
type PJSFn = { vendors?: PJSVendors };
type PJSInstance = { fn?: PJSFn };
type PJSDomEntry = { pJS?: PJSInstance };

declare global {
  interface Window {
    particlesJS?: {
      load: (id: string, config: object, cb?: () => void) => void;
    };
    pJSDom?: PJSDomEntry[] | null;
  }
}

const config = {
  particles: {
    number: { value: 84, density: { enable: true, value_area: 2000 } },
    color: {
      value: [
        "#22d3ee", // cyan
        "#ffd100", // yellow accent
        "#0e7490", // teal dark
        "#a5f3fc", // light cyan
        "#083344", // deep slate-blue
        "#cffafe", // very light cyan
        "#cbd5e1", // slate-200
      ],
    },
    shape: { type: "polygon", polygon: { nb_sides: 4 } },
    opacity: { value: 1 },
    size: { value: 12, random: true },
    line_linked: {
      enable: true,
      distance: 220,
      color: "#22d3ee",
      opacity: 0.35,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.55,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
    },
  },
  interactivity: {
    detect_on: "window",
    events: {
      onhover: { enable: true, mode: "grab" },
      onclick: { enable: true, mode: "push" },
      resize: true,
    },
    modes: {
      grab: { distance: 160, line_linked: { opacity: 0.9 } },
      bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
      repulse: { distance: 200, duration: 0.4 },
      push: { particles_nb: 1 },
      remove: { particles_nb: 2 },
    },
  },
  retina_detect: true,
};

export default function ParticlesBackground() {
  useEffect(() => {
    const SCRIPT_SRC = "/particles.js";

    const removeCanvases = () => {
      document
        .querySelectorAll<HTMLCanvasElement>(".particles-js-canvas-el")
        .forEach((c) => c.parentElement?.removeChild(c));
    };

    const initParticles = () => {
      if (!window.particlesJS) {
        console.warn(
          "[Particles] window.particlesJS not found. Check /public/particles.js"
        );
        return;
      }
      if (!Array.isArray(window.pJSDom)) window.pJSDom = [];

      removeCanvases();
      window.particlesJS.load("particles-js", config, () => {
        const canvas = document.querySelector<HTMLCanvasElement>(
          ".particles-js-canvas-el"
        );
        if (canvas) {
          canvas.style.opacity = "1";
          canvas.style.pointerEvents = "none";
          canvas.setAttribute("aria-hidden", "true");
          canvas.style.zIndex = "0";
        }
      });
    };

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`
    );
    if (existing) {
      initParticles();
      return () => removeCanvases();
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = initParticles;
    script.onerror = () =>
      console.error(`[Particles] Failed to load ${SCRIPT_SRC}`);
    document.body.appendChild(script);

    return () => {
      script.onload = null;
      removeCanvases();
    };
  }, []);

  return (
    <div
      id="particles-js"
      className="absolute inset-0 z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
