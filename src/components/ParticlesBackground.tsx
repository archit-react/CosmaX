import { useEffect } from "react";

/** particles.js globals */
type PJSVendors = { destroypJS?: () => void };
type PJSFn = { vendors?: PJSVendors };
type PJSInstance = { fn?: PJSFn };
type PJSDomEntry = { pJS?: PJSInstance };

declare global {
  interface Window {
    /** Two call signatures in the wild:
     *  1) particlesJS(id, configObject)
     *  2) particlesJS.load(id, jsonPath, cb)
     */
    particlesJS?: {
      (id: string, config: object): void;
      load?: (id: string, jsonPath: string, cb?: () => void) => void;
    };
    pJSDom?: PJSDomEntry[] | null;
  }
}

/** JSR-like config (object mode) */
const config = {
  particles: {
    number: { value: 84, density: { enable: true, value_area: 2000 } },
    color: {
      value: [
        "#22d3ee",
        "#ffd100",
        "#0e7490",
        "#a5f3fc",
        "#083344",
        "#cffafe",
        "#cbd5e1",
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

    /** Fully destroy any running instances (best for HMR) */
    const destroyParticles = () => {
      if (Array.isArray(window.pJSDom)) {
        window.pJSDom.forEach((entry) =>
          entry.pJS?.fn?.vendors?.destroypJS?.()
        );
        window.pJSDom = [];
      }
      // remove stray canvases if any
      document
        .querySelectorAll<HTMLCanvasElement>(".particles-js-canvas-el")
        .forEach((c) => c.parentElement?.removeChild(c));
    };

    /** Safe init using the in-memory config object */
    const initParticles = () => {
      if (!window.particlesJS) {
        console.warn(
          "[Particles] window.particlesJS not found. Ensure /public/particles.js exists."
        );
        return;
      }

      // host styles (JSR gradient over deep slate)
      const host = document.getElementById("particles-js");
      if (!host) {
        console.warn("[Particles] #particles-js container not found.");
        return;
      }
      host.style.background =
        "linear-gradient(to bottom, rgba(9,12,16,0.0) 0%, rgba(9,12,16,0.35) 55%, rgba(9,12,16,0.6) 100%), #0b1117";
      host.style.position = "absolute";
      host.style.inset = "0";
      host.style.zIndex = "0";

      destroyParticles(); // clean before init

      // ✅ object-mode init (not .load)
      window.particlesJS!("particles-js", config);

      // post-init canvas tweaks
      const canvas = document.querySelector<HTMLCanvasElement>(
        ".particles-js-canvas-el"
      );
      if (canvas) {
        canvas.style.opacity = "1";
        canvas.style.pointerEvents = "none";
        canvas.setAttribute("aria-hidden", "true");
        canvas.style.zIndex = "0";
      }
    };

    // Load script once if needed, then init
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`
    );
    if (existing) {
      initParticles();
    } else {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = initParticles;
      script.onerror = () =>
        console.error(
          `[Particles] Failed to load ${SCRIPT_SRC}. Place particles.js in /public.`
        );
      document.body.appendChild(script);
    }

    // Cleanup on unmount/HMR
    return () => {
      destroyParticles();
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
