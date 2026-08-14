"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { ATTACHMENTS, estimateSchema } from "@/lib/estimate-schema";
import { rateLimit } from "@/lib/rate-limit";
import { site } from "@/lib/site";

export type EstimateState = {
  status: "idle" | "success" | "error";
  message?: string;
};

/** Escape user-supplied text before interpolating into the HTML email body. */
function esc(value: string | undefined | null): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const GENERIC_ERROR = `Sorry — something went wrong sending your request. Please call ${site.phoneDisplay} and we'll take care of it.`;

export async function submitEstimate(
  _prev: EstimateState,
  formData: FormData,
): Promise<EstimateState> {
  // Rate limit by client IP before doing any work.
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "unknown";
  const limit = rateLimit(`estimate:${ip}`, 5, 60_000);
  if (!limit.ok) {
    return {
      status: "error",
      message: `Too many requests — please wait ${limit.retryAfter}s and try again, or call ${site.phoneDisplay}.`,
    };
  }

  // Validate text fields (never trust the client).
  const parsed = estimateSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    location: formData.get("location"),
    projectType: formData.get("projectType"),
    budget: formData.get("budget") ?? "",
    timeline: formData.get("timeline") ?? "",
    message: formData.get("message") ?? "",
    contactMethod: formData.get("contactMethod") ?? "",
    company: formData.get("company") ?? "",
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
    };
  }
  const data = parsed.data;

  // Anti-spam: honeypot must be empty; reject implausibly fast submissions.
  // Silently "succeed" so bots aren't tipped off.
  const renderedAt = Number(formData.get("renderedAt") ?? 0);
  const elapsed = Date.now() - renderedAt;
  if (data.company || (renderedAt > 0 && elapsed < 2000)) {
    return { status: "success", message: "Request received." };
  }

  // Validate photo attachments server-side.
  const files = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > ATTACHMENTS.maxCount) {
    return {
      status: "error",
      message: `Please attach at most ${ATTACHMENTS.maxCount} photos.`,
    };
  }
  let total = 0;
  const attachments: { filename: string; content: Buffer }[] = [];
  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return { status: "error", message: "Photos must be image files." };
    }
    if (file.size > ATTACHMENTS.maxBytesEach) {
      return { status: "error", message: "Each photo must be under 3MB." };
    }
    total += file.size;
    if (total > ATTACHMENTS.maxBytesTotal) {
      return {
        status: "error",
        message: "Total photo size must be under 10MB.",
      };
    }
    attachments.push({
      filename: file.name.replace(/[^\w.\-]/g, "_").slice(0, 100) || "photo",
      content: Buffer.from(await file.arrayBuffer()),
    });
  }

  const rows: [string, string][] = [
    ["Name", data.name],
    ["Phone", data.phone],
    ["Email", data.email],
    ["Location", data.location],
    ["Project type", data.projectType],
    ["Budget", data.budget || "Not provided"],
    ["Timeline", data.timeline || "Not provided"],
    ["Preferred contact", data.contactMethod || "Not provided"],
  ];

  const html = `
    <h2 style="font-family:sans-serif">New estimate request</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 12px 4px 0;color:#666">${esc(k)}</td><td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`,
        )
        .join("")}
    </table>
    ${data.message ? `<p style="font-family:sans-serif"><strong>Message:</strong><br>${esc(data.message).replace(/\n/g, "<br>")}</p>` : ""}
    ${attachments.length ? `<p style="font-family:sans-serif;color:#666">${attachments.length} photo(s) attached.</p>` : ""}
  `;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ESTIMATE_TO_EMAIL ?? "morrisjeffjr1993@gmail.com";
  // Placeholder sender until a domain is verified with Resend; resend.dev
  // senders can only deliver to the account owner's own address.
  const from =
    process.env.ESTIMATE_FROM_EMAIL ??
    "Perfect Home Renovation <onboarding@resend.dev>";

  if (!apiKey) {
    // No-key dev mode: log and succeed so the flow is fully testable.
    console.log("[estimate] RESEND_API_KEY unset — logging instead of sending:", {
      ...data,
      company: undefined,
      photos: attachments.map((a) => a.filename),
    });
    return {
      status: "success",
      message: `Thanks — we'll reach out within one business day. Need to talk sooner? Call ${site.phoneDisplay}.`,
    };
  }

  // Defense-in-depth: strip CR/LF from values used in the subject header.
  const safeName = data.name.replace(/[\r\n]+/g, " ").slice(0, 120);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Estimate request from ${safeName} (${data.projectType})`,
      html,
      attachments: attachments.length ? attachments : undefined,
    });
    if (error) {
      console.error("[estimate] Resend error:", error.name);
      return { status: "error", message: GENERIC_ERROR };
    }
  } catch (err) {
    console.error(
      "[estimate] Unexpected send failure:",
      err instanceof Error ? err.name : "unknown",
    );
    return { status: "error", message: GENERIC_ERROR };
  }

  return {
    status: "success",
    message: `Thanks — we'll reach out within one business day to schedule your free consultation. Need to talk sooner? Call ${site.phoneDisplay}.`,
  };
}
