import { useEffect } from "react";

declare global {
  interface Window {
    particlesJS?: {
      load: (id: string, config: object, cb?: () => void) => void;
    };
    pJSDom?: Array<{
      pJS?: { fn?: { vendors?: { destroypJS?: () => void } } };
    }>;
  }
}

const config = {
  particles: {
    number: { value: 56, density: { enable: true, value_area: 2084 } },
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
    shape: {
      type: "polygon",
      stroke: { width: 0, color: "#22d3ee" },
      polygon: { nb_sides: 4 },
    },
    opacity: { value: 1, random: false },
    size: { value: 14, random: true },
    line_linked: {
      enable: true,
      distance: 160,
      color: "#22d3ee",
      opacity: 1,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.45,
      direction: "top",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
    },
  },
  interactivity: {
    // KEY CHANGE: listen on the window so hover/click works under your UI
    detect_on: "window",
    events: {
      onhover: { enable: true, mode: "grab" },
      onclick: { enable: true, mode: "push" },
      resize: true,
    },
    modes: {
      grab: { distance: 140, line_linked: { opacity: 1 } },
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
    // ensure the script exists in /public (Vite) as /particles.js
    const SCRIPT_SRC = "/particles.js";

    // Destroy any previous instance (Vite HMR / route changes)
    const destroyExisting = () => {
      if (window.pJSDom && window.pJSDom.length) {
        window.pJSDom.forEach((d) => d?.pJS?.fn?.vendors?.destroypJS?.());
        window.pJSDom.length = 0;
      }
      const canvases = document.querySelectorAll(".particles-js-canvas-el");
      canvases.forEach((c) => c.parentElement?.removeChild(c));
    };

    const initParticles = () => {
      if (!window.particlesJS) return;
      destroyExisting();
      window.particlesJS.load("particles-js", config, () => {
        const canvas = document.querySelector(
          ".particles-js-canvas-el"
        ) as HTMLCanvasElement | null;
        if (canvas) {
          canvas.style.opacity = "1"; // fade-in
          canvas.style.pointerEvents = "none"; // click-through
          canvas.setAttribute("aria-hidden", "true");
        }
      });
    };

    // If script already present, init immediately
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`
    );
    if (existing) {
      initParticles();
      return destroyExisting; // cleanup on unmount
    }

    // Otherwise, load it
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = initParticles;
    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      script.onload = null;
      // (don’t remove the script tag to avoid reloading on every mount)
      destroyExisting();
    };
  }, []);

  // Full-bleed, behind everything; parent container should be relative
  return (
    <div
      id="particles-js"
      className="absolute inset-0 -z-10"
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#0d0d0d", // exact JSR bg
      }}
    />
  );
}
