// Google reviews for the homepage, fetched server-side from the Places API
// (New). The fetch is cached for 7 days (ISR data cache), so production polls
// Google roughly weekly; a failed background refresh keeps serving the last
// good copy. In dev the page is never cached, so every request refetches —
// harmless at one Place Details call per load.
//
// The section blends sources: however many Google reviews qualify (written
// text, 4+ stars) lead the grid and hardcoded testimonials fill the rest.
// Leave GOOGLE_PLACES_API_KEY / GOOGLE_PLACE_ID unset to skip the fetch
// entirely; the homepage then falls back to the hardcoded testimonials.

export type GoogleReview = {
  author: string;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string;
};

export type GoogleReviewsData = {
  rating: number;
  count: number;
  mapsUri: string;
  reviews: GoogleReview[];
};

type PlaceDetailsResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: {
    rating?: number;
    text?: { text?: string };
    authorAttribution?: { displayName?: string };
    relativePublishTimeDescription?: string;
    publishTime?: string;
  }[];
};

const FIELD_MASK = [
  "rating",
  "userRatingCount",
  "googleMapsUri",
  "reviews.rating",
  "reviews.text.text",
  "reviews.authorAttribution.displayName",
  "reviews.relativePublishTimeDescription",
  "reviews.publishTime",
].join(",");

const MIN_RATING = 4;
const MAX_REVIEWS = 3;
const MAX_TEXT_LENGTH = 300;

function truncate(text: string): string {
  if (text.length <= MAX_TEXT_LENGTH) return text;
  const cut = text.slice(0, MAX_TEXT_LENGTH);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : MAX_TEXT_LENGTH)}…`;
}

export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return null;

  let place: PlaceDetailsResponse;
  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": FIELD_MASK },
      next: { revalidate: 604800 }, // 7 days
    });
    if (!res.ok) {
      console.warn(`Google reviews fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }
    place = (await res.json()) as PlaceDetailsResponse;
  } catch (err) {
    console.warn("Google reviews fetch failed:", err);
    return null;
  }

  if (!place.rating || !place.userRatingCount || !place.googleMapsUri) return null;

  const qualifying = (place.reviews ?? [])
    .filter(
      (r) =>
        (r.rating ?? 0) >= MIN_RATING &&
        r.text?.text?.trim() &&
        r.authorAttribution?.displayName &&
        r.publishTime,
    )
    .map((r) => ({
      author: r.authorAttribution!.displayName!,
      rating: r.rating!,
      text: truncate(r.text!.text!.trim()),
      relativeTime: r.relativePublishTimeDescription ?? "",
      publishTime: r.publishTime!,
    }))
    .sort((a, b) => b.publishTime.localeCompare(a.publishTime));

  if (qualifying.length === 0) return null;

  return {
    rating: place.rating,
    count: place.userRatingCount,
    mapsUri: place.googleMapsUri,
    reviews: qualifying.slice(0, MAX_REVIEWS),
  };
}
