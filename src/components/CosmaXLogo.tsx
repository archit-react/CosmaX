import type { CSSProperties } from "react";

/** Helper to apply CSS custom properties with type safety */
const withVar = (vars: Record<string, string | number>): CSSProperties =>
  vars as CSSProperties;

/** CosmaX — blocky animated logo (JSR-inspired, single theme) */
export default function CosmaXLogo({
  className = "h-16 w-auto",
  title = "CosmaX",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      id="cosmax-logo"
      className={className}
      viewBox="0 0 72 16"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <style>{`
        /* fixed brand colors */
        #cosmax-logo { --bg:#0b1117; --pri:#a855f7; --acc:#22d3ee; }

        .bg  { fill: var(--bg); }
        .pri { fill: var(--pri); }
        .acc { fill: var(--acc); }

        /* square animation */
        .sq { transform-box: fill-box; transform-origin:center; opacity:1;
          animation: slide var(--t,900ms) cubic-bezier(.77,0,.175,1) forwards; }
        .up    { --from: translateY( 2px) }
        .down  { --from: translateY(-2px) }
        .left  { --from: translateX( 2px) }
        .right { --from: translateX(-2px) }

        @keyframes slide { 
          0%,60% { transform: var(--from) } 
          100%   { transform: translate(0,0) } 
        }

        /* glow */
        #letters { 
          filter: drop-shadow(0 0 6px var(--acc)) 
                  drop-shadow(0 0 12px var(--pri)); 
        }

        @media (prefers-reduced-motion: reduce) {
          .sq { animation: none !important; }
        }
      `}</style>

      {/* background plate */}
      <rect className="bg" x="0" y="0" width="72" height="16" rx="2" />

      <g id="letters">
        {/* C */}
        <g transform="translate(2,2)">
          <rect
            className="sq pri up"
            x="0"
            y="0"
            width="8"
            height="2"
            style={withVar({ "--t": "880ms" })}
          />
          <rect
            className="sq pri left"
            x="0"
            y="0"
            width="2"
            height="10"
            style={withVar({ "--t": "960ms" })}
          />
          <rect
            className="sq pri down"
            x="0"
            y="8"
            width="8"
            height="2"
            style={withVar({ "--t": "1020ms" })}
          />
          <rect className="bg" x="6" y="2" width="2" height="6" />
        </g>

        {/* O */}
        <g transform="translate(13,2)">
          <rect
            className="sq acc up"
            x="0"
            y="0"
            width="10"
            height="2"
            style={withVar({ "--t": "920ms" })}
          />
          <rect
            className="sq acc left"
            x="0"
            y="0"
            width="2"
            height="10"
            style={withVar({ "--t": "1000ms" })}
          />
          <rect
            className="sq acc right"
            x="8"
            y="0"
            width="2"
            height="10"
            style={withVar({ "--t": "940ms" })}
          />
          <rect
            className="sq acc down"
            x="0"
            y="8"
            width="10"
            height="2"
            style={withVar({ "--t": "1080ms" })}
          />
          <rect className="bg" x="3" y="3" width="4" height="4" rx="0.5" />
        </g>

        {/* S */}
        <g transform="translate(25,2)">
          <rect
            className="sq pri up"
            x="0"
            y="0"
            width="10"
            height="2"
            style={withVar({ "--t": "880ms" })}
          />
          <rect
            className="sq pri left"
            x="0"
            y="0"
            width="2"
            height="5"
            style={withVar({ "--t": "980ms" })}
          />
          <rect
            className="sq pri"
            x="0"
            y="4"
            width="10"
            height="2"
            style={withVar({ "--t": "1020ms", "--from": "translateY(2px)" })}
          />
          <rect
            className="sq pri right"
            x="8"
            y="4"
            width="2"
            height="6"
            style={withVar({ "--t": "1100ms" })}
          />
          <rect
            className="sq pri down"
            x="0"
            y="8"
            width="10"
            height="2"
            style={withVar({ "--t": "1160ms" })}
          />
        </g>

        {/* M */}
        <g transform="translate(37,2)">
          <rect
            className="sq acc left"
            x="0"
            y="0"
            width="2"
            height="10"
            style={withVar({ "--t": "900ms" })}
          />
          <rect
            className="sq acc right"
            x="10"
            y="0"
            width="2"
            height="10"
            style={withVar({ "--t": "980ms" })}
          />
          <rect
            className="sq acc up"
            x="2"
            y="0"
            width="2"
            height="6"
            style={withVar({ "--t": "1040ms" })}
          />
          <rect
            className="sq acc up"
            x="4"
            y="2"
            width="2"
            height="4"
            style={withVar({ "--t": "1080ms" })}
          />
          <rect
            className="sq acc up"
            x="6"
            y="2"
            width="2"
            height="4"
            style={withVar({ "--t": "1120ms" })}
          />
          <rect
            className="sq acc up"
            x="8"
            y="0"
            width="2"
            height="6"
            style={withVar({ "--t": "1160ms" })}
          />
        </g>

        {/* A */}
        <g transform="translate(51,2)">
          <rect
            className="sq pri left"
            x="0"
            y="2"
            width="2"
            height="8"
            style={withVar({ "--t": "900ms" })}
          />
          <rect
            className="sq pri right"
            x="8"
            y="2"
            width="2"
            height="8"
            style={withVar({ "--t": "980ms" })}
          />
          <rect
            className="sq pri up"
            x="2"
            y="0"
            width="6"
            height="2"
            style={withVar({ "--t": "1040ms" })}
          />
          <rect
            className="sq pri"
            x="2"
            y="4"
            width="6"
            height="2"
            style={withVar({ "--t": "1120ms", "--from": "translateY(2px)" })}
          />
        </g>

        {/* X */}
        <g transform="translate(63,2)">
          <rect
            className="sq acc left"
            x="0"
            y="0"
            width="2"
            height="2"
            style={withVar({ "--t": "900ms" })}
          />
          <rect
            className="sq acc up"
            x="2"
            y="2"
            width="2"
            height="2"
            style={withVar({ "--t": "960ms" })}
          />
          <rect
            className="sq acc up"
            x="4"
            y="4"
            width="2"
            height="2"
            style={withVar({ "--t": "1020ms" })}
          />
          <rect
            className="sq acc up"
            x="6"
            y="6"
            width="2"
            height="2"
            style={withVar({ "--t": "1080ms" })}
          />
          <rect
            className="sq acc right"
            x="6"
            y="0"
            width="2"
            height="2"
            style={withVar({ "--t": "940ms" })}
          />
          <rect
            className="sq acc down"
            x="4"
            y="2"
            width="2"
            height="2"
            style={withVar({ "--t": "1000ms" })}
          />
          <rect
            className="sq acc down"
            x="2"
            y="4"
            width="2"
            height="2"
            style={withVar({ "--t": "1060ms" })}
          />
          <rect
            className="sq acc down"
            x="0"
            y="6"
            width="2"
            height="2"
            style={withVar({ "--t": "1120ms" })}
          />
        </g>
      </g>
    </svg>
  );
}
