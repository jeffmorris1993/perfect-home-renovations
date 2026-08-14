export const site = {
  name: "Perfect Home Renovation",
  tagline: "Quality Renovations Done Right",
  phoneDisplay: "313-502-4555",
  phoneHref: "tel:+13135024555",
  phoneE164: "+13135024555",
  region: "Metro Detroit, MI",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://perfect-home-renovations.vercel.app",
} as const;

export const nav = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Free Estimate", href: "/estimate" },
] as const;

export const services = [
  {
    num: "01",
    name: "Bathroom Remodeling",
    desc: "Spa-grade primary baths, efficient guest baths, and full plumbing reconfigurations.",
    detail:
      "Spa-grade primary baths and efficient guest baths, custom tile, modern fixtures, better lighting, and smart plumbing reconfigurations that fix dated, cramped layouts for good.",
    bullets: [
      "Curbless showers & large-format tile",
      "Heated floors and modern ventilation",
      "Typical timeline: 3 to 5 weeks",
    ],
    cta: "Get a bathroom estimate",
    tag: "Most Requested",
    photoCategory: "bathrooms",
  },
  {
    num: "02",
    name: "Kitchen Remodeling",
    desc: "Open layouts, custom cabinetry, and durable surfaces designed for real family life.",
    detail:
      "Open layouts, custom cabinetry, and durable surfaces designed for how your family actually cooks and gathers. The hardest-working room, done right.",
    bullets: [
      "Wall removal and structural openings",
      "Custom cabinetry and stone surfaces",
      "Typical timeline: 5 to 8 weeks",
    ],
    cta: "Get a kitchen estimate",
    photoCategory: "kitchens",
  },
  {
    num: "03",
    name: "Basement Finishing",
    desc: "Add livable square footage with suites, theaters, gyms, and income-ready spaces.",
    detail:
      "Turn unused square footage into living space, guest suites, theaters, gyms, bars, and income-ready in-law units, with proper egress and moisture control.",
    bullets: [
      "Egress windows and permitting handled",
      "Moisture, insulation, and sound control",
      "Income-ready suite layouts",
    ],
    cta: "Get a basement estimate",
    photoCategory: "basements",
  },
  {
    num: "04",
    name: "Full Home Renovations",
    desc: "Whole-house transformations that modernize older Detroit-area homes end to end.",
    detail:
      "Whole-house transformations that modernize older Detroit-area homes end to end, covering layout, systems, and finishes, while keeping the character worth keeping.",
    bullets: [
      "Electrical, plumbing, and HVAC updates",
      "Layout reconfiguration and additions",
      "Historic-character preservation",
    ],
    cta: "Plan a full renovation",
    photoCategory: "stairs",
  },
  {
    num: "05",
    name: "Flooring & Tile",
    desc: "Hardwood, large-format tile, and precision detail work that lasts.",
    detail:
      "Hardwood, large-format porcelain, heated floors, and precision detail work. The craftsmanship that separates a good renovation from a great one.",
    bullets: [
      "Hardwood install and refinishing",
      "Large-format and mosaic tile work",
      "Heated floor systems",
    ],
    cta: "Get a flooring estimate",
    photoCategory: "fireplace",
  },
  {
    num: "06",
    name: "Roofing",
    desc: "Full replacement and repair, from tear-off through flashing and ventilation.",
    detail:
      "Full roof replacement and repair on Metro Detroit homes, including tear-off, decking repair, underlayment, flashing, and ventilation done to spec.",
    bullets: [
      "Complete tear-off and replacement",
      "Decking, flashing, and ventilation repair",
      "Storm and leak damage assessments",
    ],
    cta: "Get a roofing estimate",
    photoCategory: "exterior",
  },
  {
    num: "07",
    name: "Custom Homes",
    desc: "Ground-up modern homes for Metro Detroit, launching soon.",
    detail:
      "Ground-up modern homes for Metro Detroit. Custom home builds are launching soon, with the same standard of craftsmanship and communication we bring to every renovation.",
    bullets: [
      "Modern residential design",
      "Clear scope and budgeting",
      "One accountable team, start to finish",
    ],
    cta: "Ask about custom homes",
    tag: "Coming Soon",
    tagBrass: true,
    photoCategory: "exterior",
  },
] as const;

export const areas = [
  "Detroit",
  "Boston-Edison",
  "Ferndale",
  "Royal Oak",
  "Birmingham",
  "Pleasant Ridge",
  "Troy",
  "Grosse Pointe",
  "Huntington Woods",
] as const;

export const testimonials = [
  {
    quote:
      "“They turned a chopped-up 1940s layout into the open, light-filled home we always pictured, and they kept us in the loop the whole way.”",
    name: "Maria & Devon T.",
    meta: "Full Renovation · Pleasant Ridge",
  },
  {
    quote:
      "“Our bathroom remodel came out exactly how we hoped. The crew respected our house and cleaned up every single day.”",
    name: "Karen S.",
    meta: "Bathroom · Royal Oak",
  },
  {
    quote:
      "“They finished our basement and we use it every day. Straightforward people, quality work, and no runaround.”",
    name: "James R.",
    meta: "Basement · Detroit",
  },
] as const;

export const faqs = [
  {
    q: "How much does a renovation cost?",
    a: "It depends entirely on the scope of the work. Every project starts with a free estimate, so you get a number based on your actual home rather than a guess from a price list.",
  },
  {
    q: "Do you offer free estimates?",
    a: "Yes. Every project starts with a free estimate. Request one online or call 313-502-4555.",
  },
  {
    q: "How long will my project take?",
    a: "Timelines depend on the size of the project and how much is being changed. We will walk you through what to expect for your specific job when we look at it in person.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Fully licensed and insured for residential construction across Metro Detroit, with permits pulled on every applicable job.",
  },
  {
    q: "Do you work on older Detroit homes?",
    a: "Constantly. Much of the metro's housing stock is pre-1960. We specialize in modernizing older homes, electrical, plumbing, and layout, while respecting the character that makes them worth saving.",
  },
] as const;

export const processSteps = [
  {
    num: "01",
    title: "Start With Your Project",
    body: "Tell us what you're looking to change and send a few photos.",
  },
  {
    num: "02",
    title: "Free On-Site Estimate",
    body: "We'll take a closer look, talk through the work, and help define the scope.",
  },
  {
    num: "03",
    title: "Quality Work, Done Right",
    body: "Your renovation is completed with a focus on craftsmanship, communication, and staying on track.",
  },
  {
    num: "04",
    title: "A Space That Feels Finished",
    body: "From bathrooms and kitchens to larger renovations, the goal is work you're proud to live with.",
  },
] as const;

export const whyUs = [
  {
    title: "Design-forward",
    body: "Modern, architectural taste applied to real homes, not catalog kitchens.",
  },
  {
    title: "In-house crews",
    body: "Our own people do the work. Accountability doesn't get subcontracted away.",
  },
  {
    title: "Clear communication",
    body: "One point of contact, and honest answers about where your project stands.",
  },
  {
    title: "Free estimates",
    body: "We look at the work in person and talk through scope before anything starts.",
  },
  {
    title: "Durable materials",
    body: "We spec finishes that survive Michigan winters and decades of family life.",
  },
  {
    title: "Local & licensed",
    body: "Metro Detroit born. Fully licensed, insured, and permitted on every job.",
  },
] as const;

export const marqueeItems = [
  "Kitchens",
  "Bathrooms",
  "Basements",
  "Full Renovations",
  "Flooring & Tile",
  "Roofing",
  "Custom Homes",
] as const;
