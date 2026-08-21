"use client";

import { useEffect } from "react";

// Native lazy-loading margins (Safari's especially) are conservative, so
// tiles pop in visibly while scrolling. Flip images to eager once they come
// within ~1600px of the viewport — the fetch starts well before arrival.
export function useEagerNear(
  ref: React.RefObject<HTMLElement | null>,
  deps: React.DependencyList,
) {
  useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLImageElement).loading = "eager";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "1600px 0px" },
    );
    const imgs = root.querySelectorAll<HTMLImageElement>('img[loading="lazy"]');
    for (const img of imgs) io.observe(img);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
