"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitEstimate, type EstimateState } from "@/app/actions/estimate";
import {
  ATTACHMENTS,
  budgetRanges,
  contactMethods,
  estimateDefaults,
  estimateSchema,
  projectTypes,
  timelines,
  type EstimateInput,
} from "@/lib/estimate-schema";
import { site } from "@/lib/site";

const initial: EstimateState = { status: "idle" };

type Picked = { file: File; url: string };

// Vercel caps request bodies around 4.5MB, so raw iPhone photos (2–3MB each)
// would 413 in production. Downscale on the client before submit: max 1600px,
// JPEG q0.8 — roughly 250–500KB per photo.
async function downscale(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 600 * 1024) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.8),
    );
    if (!blob) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return file; // HEIC or decode failure — let the server-side caps decide
  }
}

export function EstimateForm() {
  const [state, setState] = useState<EstimateState>(initial);
  const [isPending, startTransition] = useTransition();
  const [photos, setPhotos] = useState<Picked[]>([]);
  const [photoError, setPhotoError] = useState("");
  // Mount time for the anti-spam timing check.
  const [renderedAt] = useState(() => Date.now());

  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(
    () => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)),
    [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EstimateInput>({
    resolver: zodResolver(estimateSchema),
    defaultValues: estimateDefaults,
    mode: "onBlur",
  });

  const addFiles = (list: FileList | null) => {
    const next = [...photos];
    let err = "";
    for (const file of Array.from(list ?? [])) {
      if (next.length >= ATTACHMENTS.maxCount) {
        err = `You can attach up to ${ATTACHMENTS.maxCount} photos.`;
        break;
      }
      if (!file.type.startsWith("image/")) {
        err = "Only image files can be attached.";
        continue;
      }
      const dupe = next.some(
        (p) =>
          p.file.name === file.name &&
          p.file.size === file.size &&
          p.file.lastModified === file.lastModified,
      );
      if (!dupe) next.push({ file, url: URL.createObjectURL(file) });
    }
    setPhotos(next);
    setPhotoError(err);
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photos[index].url);
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoError("");
  };

  const onValid = (data: EstimateInput) => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("name", data.name);
      fd.set("phone", data.phone);
      fd.set("email", data.email);
      fd.set("location", data.location);
      fd.set("projectType", data.projectType);
      fd.set("budget", data.budget ?? "");
      fd.set("timeline", data.timeline ?? "");
      fd.set("message", data.message ?? "");
      fd.set("contactMethod", data.contactMethod ?? "");
      fd.set("company", data.company ?? "");
      fd.set("renderedAt", String(renderedAt));
      const scaled = await Promise.all(
        photos.slice(0, ATTACHMENTS.maxCount).map((p) => downscale(p.file)),
      );
      scaled.forEach((f) => fd.append("photos", f));
      setState(await submitEstimate(initial, fd));
    });
  };

  if (state.status === "success") {
    return (
      <div className="est-success">
        <div className="est-success-mark">✓</div>
        <h2 className="h2">Request received.</h2>
        <p className="lead mt-s" style={{ marginInline: "auto" }}>
          {state.message}
        </p>
        <div className="btn-row mt-m" style={{ justifyContent: "center" }}>
          <Link className="btn btn-ghost" href="/portfolio">
            View Our Work While You Wait <span className="arr">→</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="est-form" onSubmit={handleSubmit(onValid)} noValidate>
      <div className="est-form-head">Project Details</div>
      <div className="est-form-body">
        {/* Honeypot — hidden from humans, catches bots */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: -9999, top: "auto" }}
        >
          <label>
            Company
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("company")}
            />
          </label>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="est-name">
              Full Name <span className="req">*</span>
            </label>
            <input
              id="est-name"
              placeholder="Jane Homeowner"
              autoComplete="name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <span className="field-error">{errors.name.message}</span>
            )}
          </div>
          <div className="field">
            <label htmlFor="est-phone">
              Phone <span className="req">*</span>
            </label>
            <input
              id="est-phone"
              type="tel"
              placeholder="313-555-0100"
              autoComplete="tel"
              aria-invalid={!!errors.phone}
              {...register("phone")}
            />
            {errors.phone && (
              <span className="field-error">{errors.phone.message}</span>
            )}
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="est-email">
              Email <span className="req">*</span>
            </label>
            <input
              id="est-email"
              type="email"
              placeholder="jane@email.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </div>
          <div className="field">
            <label htmlFor="est-location">
              Project Address or City <span className="req">*</span>
            </label>
            <input
              id="est-location"
              placeholder="Royal Oak, MI"
              autoComplete="address-level2"
              aria-invalid={!!errors.location}
              {...register("location")}
            />
            {errors.location && (
              <span className="field-error">{errors.location.message}</span>
            )}
          </div>
        </div>

        <div className="field">
          <span className="field-label">
            Project Type <span className="req">*</span>
          </span>
          <div className="choice-grid">
            {projectTypes.map((t) => (
              <label key={t} className="choice">
                <input type="radio" value={t} {...register("projectType")} />
                <span>{t}</span>
              </label>
            ))}
          </div>
          {errors.projectType && (
            <span className="field-error">{errors.projectType.message}</span>
          )}
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="est-budget">Budget Range</label>
            <select id="est-budget" {...register("budget")}>
              <option value="">Select a range</option>
              {budgetRanges.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="est-timeline">Desired Timeline</label>
            <select id="est-timeline" {...register("timeline")}>
              <option value="">Select a timeline</option>
              {timelines.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <span className="field-label">Upload Photos (optional)</span>
          <label className="upload">
            <input
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <span>
              {photos.length
                ? `${photos.length} photo${photos.length > 1 ? "s" : ""} selected — click to add more`
                : "Drag photos here, or click to browse"}
            </span>
          </label>
          {photoError && <span className="field-error">{photoError}</span>}
          {photos.length > 0 && (
            <div className="upload-previews">
              {photos.map((p, i) => (
                <div key={p.url} className="upload-preview">
                  <img src={p.url} alt={`Photo ${i + 1}`} />
                  <button
                    type="button"
                    aria-label={`Remove photo ${i + 1}`}
                    onClick={() => removePhoto(i)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="field">
          <label htmlFor="est-message">Project Details</label>
          <textarea
            id="est-message"
            placeholder="Tell us about the space, what's not working, and what you're hoping for. The more detail, the better the estimate."
            {...register("message")}
          />
        </div>

        <div className="field">
          <span className="field-label">Preferred Contact Method</span>
          <div
            className="choice-grid"
            style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
          >
            {contactMethods.map((m) => (
              <label key={m} className="choice">
                <input type="radio" value={m} {...register("contactMethod")} />
                <span>{m}</span>
              </label>
            ))}
          </div>
        </div>

        {state.status === "error" && (
          <p className="form-error" role="alert">
            {state.message}
          </p>
        )}

        <button
          className="btn btn-brass lg"
          type="submit"
          disabled={isPending}
          style={{ width: "100%", justifyContent: "center" }}
        >
          {isPending ? "Sending…" : "Request My Free Estimate"}{" "}
          <span className="arr">→</span>
        </button>
        <p className="est-fine">
          By submitting, you agree to be contacted about your project. No spam,
          ever.
        </p>
      </div>
    </form>
  );
}
