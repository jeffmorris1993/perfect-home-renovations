"use client";

import { useRef, useState } from "react";
import { baSrc, baSrcSet, type BaPair } from "@/lib/portfolio";

// Drag-to-compare slider, ported from the design's wireBeforeAfter():
// the "before" layer sits on top and is clipped from the right; dragging
// moves the clip edge. Keyboard-accessible via the slider role.
export function BeforeAfter({
  pair,
  caption,
  dark = false,
  sizes = "(min-width: 760px) 46vw, 92vw",
}: {
  pair: BaPair;
  caption?: string;
  dark?: boolean;
  sizes?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const setFromClientX = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div>
      <div
        ref={ref}
        className="ba"
        role="slider"
        aria-label={`Before and after comparison${caption ? `: ${caption}` : ""}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        tabIndex={0}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging.current) setFromClientX(e.clientX);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
          if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
        }}
      >
        <div className="ba-img">
          <img
            src={baSrc(pair.after, 960)}
            srcSet={baSrcSet(pair.after)}
            sizes={sizes}
            width={pair.after.width}
            height={pair.after.height}
            alt="After the renovation"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
        <div
          className="ba-img ba-before"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <img
            src={baSrc(pair.before, 960)}
            srcSet={baSrcSet(pair.before)}
            sizes={sizes}
            width={pair.before.width}
            height={pair.before.height}
            alt="Before the renovation"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
        <span className="ba-tag before">Before</span>
        <span className="ba-tag after">After</span>
        <div className="ba-handle" style={{ left: `${pos}%` }} />
        <div className="ba-knob" style={{ left: `${pos}%` }}>
          ↔
        </div>
      </div>
      {caption ? (
        <p className={dark ? "ba-cap ba-cap-dark" : "ba-cap"}>{caption}</p>
      ) : null}
    </div>
  );
}
