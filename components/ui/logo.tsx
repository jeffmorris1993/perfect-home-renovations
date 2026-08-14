import { existsSync } from "node:fs";
import path from "node:path";
import { site } from "@/lib/site";

// The brand wordmark PNG is optional — when public/img/phr-wordmark.png is
// present it's used verbatim; otherwise a styled text lockup stands in.
const hasWordmarkPng = existsSync(
  path.join(process.cwd(), "public/img/phr-wordmark.png"),
);

export function Brand({ className = "brand" }: { className?: string }) {
  return (
    <span className={className}>
      <img
        className="brand-mark"
        src="/img/phr-mark.png"
        alt=""
        width={600}
        height={595}
      />
      {hasWordmarkPng ? (
        <img
          className="brand-word"
          src="/img/phr-wordmark.png"
          alt={site.name}
        />
      ) : (
        <span className="brand-text">
          Perfect Home
          <br />
          Renovation
        </span>
      )}
    </span>
  );
}
