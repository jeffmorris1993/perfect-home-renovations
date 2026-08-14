"use client";

import { useCallback, useEffect, useRef } from "react";

export interface LightboxItem {
  src: string;
  srcSet: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
}

// Custom zero-dependency lightbox on native <dialog> (focus trap + Escape
// for free). The item list is built from the visible gallery DOM, so there
// is no duplicate photo manifest shipped to the client.
export function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);
  const item = items[index];

  useEffect(() => {
    const d = dialogRef.current;
    if (d && !d.open) d.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const step = useCallback(
    (delta: number) => {
      onNavigate((index + delta + items.length) % items.length);
    },
    [index, items.length, onNavigate],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  // Preload neighbors for instant arrow/swipe navigation.
  useEffect(() => {
    for (const delta of [1, -1]) {
      const neighbor = items[(index + delta + items.length) % items.length];
      if (!neighbor) continue;
      const img = new Image();
      img.srcset = neighbor.srcSet;
      img.sizes = "100vw";
      img.src = neighbor.src;
    }
  }, [index, items]);

  if (!item) return null;

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div
        className="lightbox-inner"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
        }}
      >
        <img
          key={item.src}
          className="lightbox-img"
          src={item.src}
          srcSet={item.srcSet}
          sizes="100vw"
          alt={item.alt}
          width={item.width}
          height={item.height}
        />
        <div className="lightbox-cap">{item.caption}</div>
      </div>
      <button
        className="lightbox-btn lightbox-prev"
        aria-label="Previous photo"
        onClick={() => step(-1)}
      >
        ←
      </button>
      <button
        className="lightbox-btn lightbox-next"
        aria-label="Next photo"
        onClick={() => step(1)}
      >
        →
      </button>
      <button className="lightbox-close" aria-label="Close" onClick={onClose}>
        ✕
      </button>
    </dialog>
  );
}
