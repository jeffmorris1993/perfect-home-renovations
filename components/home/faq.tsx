"use client";

import { useRef, useState } from "react";
import { faqs as defaultFaqs } from "@/lib/site";

// One-open-at-a-time accordion with the design's max-height animation.
export function Faq({
  items = defaultFaqs,
}: {
  items?: readonly { q: string; a: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div className="faq mt-m">
      {items.map((f, i) => {
        const open = openIndex === i;
        return (
          <div key={f.q} className={open ? "faq-item open" : "faq-item"}>
            <h3 className="faq-h">
              <button
                className="faq-q"
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? null : i)}
              >
                {f.q}
                <span className="pm" />
              </button>
            </h3>
            <div
              className="faq-a"
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              style={{
                maxHeight: open
                  ? panelRefs.current[i]?.scrollHeight
                  : undefined,
              }}
            >
              <div className="faq-a-inner">{f.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
