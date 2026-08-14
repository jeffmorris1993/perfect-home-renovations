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

/** Identify a real image by its magic bytes; returns an extension or null. */
function sniffImageExt(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.readUInt32BE(0) === 0x89504e47) return "png";
  if (
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  )
    return "webp";
  if (buf.toString("ascii", 0, 3) === "GIF") return "gif";
  if (buf.toString("ascii", 4, 8) === "ftyp") {
    const brand = buf.toString("ascii", 8, 12);
    if (["heic", "heix", "hevc", "mif1", "msf1", "heif"].includes(brand)) {
      return "heic";
    }
  }
  return null;
}

export async function submitEstimate(
  _prev: EstimateState,
  formData: FormData,
): Promise<EstimateState> {
  // Rate limit by client IP before doing any work. Trust only platform-set
  // headers: x-vercel-forwarded-for, else the RIGHTMOST x-forwarded-for hop
  // (the leftmost entries are client-supplied and spoofable).
  const hdrs = await headers();
  const ip =
    hdrs.get("x-vercel-forwarded-for")?.trim() ||
    hdrs.get("x-forwarded-for")?.split(",").pop()?.trim() ||
    hdrs.get("x-real-ip") ||
    "unknown";
  const limit = rateLimit(`estimate:${ip}`, 5, 60_000);
  // Coarse instance-wide backstop against distributed abuse of the email
  // sender (best-effort on serverless; per warm instance).
  const globalLimit = rateLimit("estimate:global", 30, 3_600_000);
  if (!limit.ok || !globalLimit.ok) {
    const retryAfter = Math.max(limit.retryAfter, globalLimit.retryAfter);
    return {
      status: "error",
      message: `Too many requests — please wait ${retryAfter}s and try again, or call ${site.phoneDisplay}.`,
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

  // Anti-spam: honeypot must be empty, and the render timestamp must be
  // present, plausible, and at least 2s old. A missing/garbage timestamp
  // fails CLOSED (scripts that skip the field don't skip the check).
  // Silently "succeed" so bots aren't tipped off.
  const renderedAt = Number(formData.get("renderedAt"));
  const elapsed = Date.now() - renderedAt;
  if (
    data.company ||
    !Number.isFinite(renderedAt) ||
    renderedAt <= 0 ||
    elapsed < 2000 ||
    elapsed > 6 * 3_600_000
  ) {
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
    // Validate actual content (magic bytes), not the client-supplied
    // Content-Type, and never echo the client's filename.
    const content = Buffer.from(await file.arrayBuffer());
    const ext = sniffImageExt(content);
    if (!ext) {
      return { status: "error", message: "Photos must be image files." };
    }
    attachments.push({
      filename: `photo-${attachments.length + 1}.${ext}`,
      content,
    });
  }

  // Branded lead email. Tables + inline styles only, for email-client compat.
  const contactRows: [string, string][] = [
    ["Name", data.name],
    ["Phone", data.phone],
    ["Email", data.email],
    ["Location", data.location],
  ];
  const projectRows: [string, string][] = [
    ["Project type", data.projectType],
    ["Budget", data.budget || "Not provided"],
    ["Desired timeline", data.timeline || "Not provided"],
    ["Preferred contact", data.contactMethod || "No preference"],
    [
      "Photos",
      attachments.length
        ? `${attachments.length} attached below`
        : "None attached",
    ],
  ];

  const row = ([k, v]: [string, string], last: boolean) => `
    <tr>
      <td style="padding:11px 16px;border-bottom:${last ? "0" : "1px solid #ececea"};font:500 11px/1.4 'Courier New',monospace;letter-spacing:1.5px;text-transform:uppercase;color:#8b9094;white-space:nowrap;vertical-align:top">${esc(k)}</td>
      <td style="padding:11px 16px;border-bottom:${last ? "0" : "1px solid #ececea"};font:600 15px/1.5 Helvetica,Arial,sans-serif;color:#101112;text-align:right">${esc(v)}</td>
    </tr>`;
  const card = (title: string, rows: [string, string][]) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fcfcfa;border:1px solid #e4e4e0;border-collapse:separate;margin:0 0 16px">
      <tr><td style="padding:12px 16px 0;font:700 11px/1 'Courier New',monospace;letter-spacing:2px;text-transform:uppercase;color:#7e6237">${esc(title)}</td></tr>
      <tr><td style="padding:4px 0 0">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          ${rows.map((r, i) => row(r, i === rows.length - 1)).join("")}
        </table>
      </td></tr>
    </table>`;

  const html = `
  <div style="margin:0;padding:24px 12px;background:#f5f5f3">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto">
      <tr>
        <td style="background:#101112;padding:26px 28px">
          <div style="font:800 20px/1.2 Helvetica,Arial,sans-serif;letter-spacing:-0.3px;color:#fcfcfa">Perfect Home Renovation</div>
          <div style="font:500 11px/1 'Courier New',monospace;letter-spacing:2.5px;text-transform:uppercase;color:#9c7c4e;padding-top:9px">New estimate request</div>
        </td>
      </tr>
      <tr>
        <td style="background:#ffffff;border:1px solid #e4e4e0;border-top:0;padding:24px 22px">
          ${card("Contact", contactRows)}
          ${card("Project", projectRows)}
          ${
            data.message
              ? `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fcfcfa;border:1px solid #e4e4e0;border-left:3px solid #7e6237;border-collapse:separate">
            <tr><td style="padding:14px 16px 0;font:700 11px/1 'Courier New',monospace;letter-spacing:2px;text-transform:uppercase;color:#7e6237">Project details</td></tr>
            <tr><td style="padding:10px 16px 16px;font:400 15px/1.65 Helvetica,Arial,sans-serif;color:#33363a">${esc(data.message).replace(/\n/g, "<br>")}</td></tr>
          </table>`
              : ""
          }
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px">
            <tr>
              <td align="center" style="padding:0">
                <a href="tel:${esc(data.phone.replace(/[^+\d]/g, ""))}" style="display:inline-block;background:#7e6237;color:#ffffff;font:600 13px/1 Helvetica,Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:14px 26px;margin:0 5px 8px">Call ${esc(data.name.split(" ")[0])}</a>
                <a href="mailto:${esc(data.email)}" style="display:inline-block;background:#101112;color:#ffffff;font:600 13px/1 Helvetica,Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:14px 26px;margin:0 5px 8px">Reply by email</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 8px;font:400 12px/1.6 Helvetica,Arial,sans-serif;color:#8b9094;text-align:center">
          Sent from the perfect-home-renovations estimate form &middot; ${new Date().toLocaleString("en-US", { timeZone: "America/Detroit", dateStyle: "long", timeStyle: "short" })} ET<br>
          Replying to this email goes straight to ${esc(data.name)}.
        </td>
      </tr>
    </table>
  </div>`;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ESTIMATE_TO_EMAIL;
  const from =
    process.env.ESTIMATE_FROM_EMAIL ??
    "Perfect Home Renovation <onboarding@resend.dev>";

  if (!apiKey || !to) {
    if (process.env.NODE_ENV !== "production") {
      // Dev-only affordance: succeed without sending. Log non-identifying
      // fields only — never the lead's contact details or message.
      console.log("[estimate] Email env unset — dev log-only mode:", {
        projectType: data.projectType,
        budget: data.budget,
        timeline: data.timeline,
        photos: attachments.length,
      });
      return {
        status: "success",
        message: `Thanks — we'll reach out within one business day. Need to talk sooner? Call ${site.phoneDisplay}.`,
      };
    }
    // In production a missing key/recipient is a misconfiguration: fail
    // loudly server-side and tell the customer to call — never pretend the
    // lead was delivered.
    console.error(
      "[estimate] MISCONFIGURED: RESEND_API_KEY and/or ESTIMATE_TO_EMAIL unset in production; submission not sent.",
    );
    return { status: "error", message: GENERIC_ERROR };
  }

  // Defense-in-depth: strip CR/LF from values used in the subject header.
  const safeName = data.name.replace(/[\r\n]+/g, " ").slice(0, 120);

  const text = [
    "New estimate request",
    "",
    ...contactRows.concat(projectRows).map(([k, v]) => `${k}: ${v}`),
    ...(data.message ? ["", "Project details:", data.message] : []),
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { data: sent, error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Estimate request from ${safeName} (${data.projectType})`,
      html,
      text,
      attachments: attachments.length ? attachments : undefined,
    });
    if (error) {
      console.error("[estimate] Resend error:", error.name, error.message);
      return { status: "error", message: GENERIC_ERROR };
    }
    console.log("[estimate] Sent via Resend, id:", sent?.id);
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
