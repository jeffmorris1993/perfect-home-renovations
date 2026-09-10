import type { PortfolioCategory } from "./portfolio";
import { site } from "./site";

/**
 * Data behind the /services/[service] and /services/[service]/[city] SEO
 * pages. Search engines treat near-duplicate location pages as doorway spam,
 * so every service+city combination gets its own hand-written copy in
 * cityCopy below. Adding a city means writing real copy for it, not just
 * adding a slug.
 */

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface CityCopy {
  /** Short hero lead, unique to this service+city pair. */
  lead: string;
  /** Body paragraphs, unique to this service+city pair. */
  body: string[];
}

export interface SeoService {
  slug: string;
  /** Matches services[].name in lib/site.ts */
  name: string;
  /** Lowercase phrase usable mid-sentence, e.g. "bathroom remodel". */
  phrase: string;
  metaDescription: string;
  /** Long-form intro paragraphs for the dedicated service page. */
  intro: string[];
  bullets: readonly string[];
  faqs: ServiceFaq[];
  photoCategory: PortfolioCategory;
  galleryFilter?: PortfolioCategory;
  cta: string;
  /** Hand-written copy per city slug. Cities listed here get a landing page. */
  cityCopy?: Record<string, CityCopy>;
}

export const seoServices: SeoService[] = [
  {
    slug: "bathroom-remodeling",
    name: "Bathroom Remodeling",
    phrase: "bathroom remodel",
    metaDescription:
      "Bathroom remodeling in Metro Detroit. Curbless showers, custom tile, heated floors, and full plumbing reconfigurations from a licensed, insured local crew. Free estimates.",
    intro: [
      "A bathroom is the hardest-working small room in the house, and it shows its age faster than any other. We remodel bathrooms across Metro Detroit, from efficient guest baths to spa-grade primary suites, with the plumbing, ventilation, and waterproofing details done right behind the walls, not just the finishes you see.",
      "Our crews handle the full scope in-house: demolition, plumbing reconfiguration, electrical, tile, glass, and fixtures. That matters in this region's housing stock, where a 1940s bathroom often hides galvanized supply lines, undersized drains, and zero ventilation. We fix the underlying problems so the new bathroom lasts.",
      "Every project starts with a free on-site estimate. We look at your actual bathroom, talk through layout options, and give you a number based on your home rather than a price list.",
    ],
    bullets: [
      "Curbless showers & large-format tile",
      "Heated floors and modern ventilation",
      "Glass enclosures & custom vanities",
    ],
    faqs: [
      {
        q: "How long does a bathroom remodel take?",
        a: "A typical full bathroom remodel runs a few weeks once work begins, depending on scope. A straightforward refresh moves faster, while layout changes and plumbing reconfiguration add time. We walk you through a realistic schedule for your specific bathroom during the free estimate.",
      },
      {
        q: "How much does a bathroom remodel cost in Metro Detroit?",
        a: "It depends on the size of the bathroom, whether the layout changes, and the finishes you choose. Rather than quoting from a price list, we look at your actual bathroom in person and give you a free, no-obligation estimate based on the real scope.",
      },
      {
        q: "Do you handle permits and inspections?",
        a: "Yes. We are licensed and insured for residential construction across Metro Detroit, and we pull permits on every applicable job, including the plumbing and electrical work inside a bathroom remodel.",
      },
      {
        q: "Can you make a small bathroom feel bigger without an addition?",
        a: "Usually, yes. Curbless showers, glass enclosures, wall-hung vanities, pocket doors, and better lighting recover a surprising amount of usable space in the compact bathrooms common in older Metro Detroit homes.",
      },
    ],
    photoCategory: "bathrooms",
    galleryFilter: "bathrooms",
    cta: "Get a bathroom estimate",
    cityCopy: {
      detroit: {
        lead: "Plenty of Detroit houses still run on their original bathroom. We bring them into this century without losing what makes the house worth keeping.",
        body: [
          "The brick colonials and bungalows in Detroit's neighborhoods were usually built with one bathroom, and it was small. Behind the tile you often find galvanized supply lines at the end of their life and a drain stack with a century of service on it. We plan for that from day one so the project doesn't stall when the walls open up.",
          "Most of our Detroit bathroom work falls into two camps: rebuilding the main bath with modern waterproofing, tile, and ventilation, or carving out a second bath so a one-bath house finally works for a family. We handle city permits and inspections on every job.",
          "Materials matter more in Detroit's masonry houses than almost anywhere else. Plaster walls, thick tile beds, and rock-solid framing reward tile and stone chosen to match their permanence, and we install to that standard. Heated floors have become the most requested upgrade here, and in a brick house that holds the cold, they earn their keep every winter.",
        ],
      },
      "boston-edison": {
        lead: "In Boston-Edison, a bathroom remodel has to respect a hundred years of craftsmanship while quietly replacing everything behind it.",
        body: [
          "These early-1900s homes have generous bathrooms by the standards of their era, often with original tile, cast iron tubs, and plaster walls. The trick is modernizing the plumbing, waterproofing, and ventilation without making the room feel like it was airlifted in from a subdivision.",
          "We source tile and fixtures that suit the period, rework supply and drain lines that have served since the Model T era, and where exterior changes are involved, we work within the historic district review process. The result is a bathroom that belongs in the house.",
          "Working in a historic home also means protecting it while we work. Floors get covered from the front door to the bathroom, original trim comes off carefully and goes back on, and dust containment goes up before demolition starts. A remodel here should leave no trace of itself outside the room it improved.",
        ],
      },
      ferndale: {
        lead: "Ferndale bungalows are famous for exactly one bathroom, and it is never big enough. We make that room work harder.",
        body: [
          "Most of our Ferndale bathroom projects are about space. A five-by-seven bath serving a whole household needs every inch: a curbless shower instead of a tub taking a third of the room, a wall-hung vanity, a pocket door, and lighting that stops the room feeling like a closet.",
          "Where the attic or basement is being converted, we also add second baths, which changes daily life in a one-bath bungalow more than any other single project. Plumbing runs in these compact houses are short, which keeps that work efficient.",
          "Ferndale owners tend to ask sharp questions about scope, and we like that. At the estimate we walk through what is worth spending on in a small bath, where stock sizes save money without showing it, and which upgrades, like heated floors or a tiled shower niche, pay off every day in a room this size.",
        ],
      },
      "royal-oak": {
        lead: "Royal Oak homeowners renovate to stay. A bathroom that still feels like 1952 is usually first on the list.",
        body: [
          "The bungalows and ranches around Royal Oak have solid bones and dated baths: shallow tubs, ceramic tile in colors nobody chose on purpose, and fans that vent nowhere. We strip these rooms to the studs, correct the ventilation, and rebuild with tile and fixtures picked to suit the house.",
          "Karen S., a Royal Oak client, put it simply: the remodel came out exactly how she hoped, and the crew respected the house and cleaned up every day. That is the standard we hold on every Royal Oak job, and permits are pulled through the city on all applicable work.",
          "Ventilation is the quiet failure in most Royal Oak baths we open up: fans that vent into the attic, or no fan at all, and the peeling paint and mildew that follow. Every bathroom we build here exhausts to the exterior, sized for the room, so the new tile and paint stay the way they looked on the final walkthrough.",
        ],
      },
      birmingham: {
        lead: "Birmingham bathrooms get judged against the best work in Metro Detroit. We build to that standard.",
        body: [
          "Projects here lean toward complete primary suites: curbless showers with large-format tile, heated floors, custom vanities, and glass work with clean sight lines. The finish quality has to hold up under close inspection, because in Birmingham it will get it.",
          "We spend more time in the design phase on these projects, aligning tile layouts, stone, plumbing fixtures, and lighting before demolition starts. That planning is why the finished room looks deliberate instead of assembled.",
          "Fixture selection gets real attention on these projects. We work through valve and trim choices, glass hardware, lighting temperature, and stone sealing with you before anything is ordered, because a bathroom at this level is a set of small decisions made well. Our crews then install what the design promised, down to the grout lines.",
        ],
      },
      "pleasant-ridge": {
        lead: "Pleasant Ridge homes are small, historic, and loved. Their bathrooms deserve the same care as the rest of the house.",
        body: [
          "In a 1920s Pleasant Ridge house, the bathroom is usually original in all the wrong ways: undersized, poorly vented, and plumbed with materials that are past their service life. We rebuild these rooms with modern waterproofing and ventilation while keeping proportions and finishes that suit the age of the home.",
          "Because these houses sit close together on compact lots, we run tidy job sites: protected floors, daily cleanup, and honest scheduling. Neighbors talk in a town this small, and we like what they say about us.",
          "Pleasant Ridge's historic district status covers the outside of the house, and while most bathroom work is interior, window changes and vents through exterior walls still need thoughtful handling. We know where that line sits and plan the project so approvals never stall the schedule.",
        ],
      },
      troy: {
        lead: "Troy's colonials and split-levels came with builder-grade baths. Forty years later, they are ready for better.",
        body: [
          "A 1970s Troy bathroom typically means a fiberglass tub surround, a cultured marble vanity, and a layout that wastes space. The good news is these houses have room to work with. We turn cramped double-sink arrangements into real primary baths, often stealing space from oversized closets next door.",
          "Because the housing stock here is newer than the inner-ring suburbs, surprises behind the walls are rarer and projects move predictably. Permits go through the City of Troy, and we handle that process start to finish.",
          "Most Troy remodels happen in occupied houses with school and work schedules running around them. We stage the project so the household keeps a working bathroom, keep the site sealed and clean, and hold to the schedule we gave you at the estimate. A remodel should disrupt a routine, not a whole season.",
        ],
      },
      "grosse-pointe": {
        lead: "A Grosse Pointe bathroom remodel is a craftsmanship test. The rest of the house sets the bar.",
        body: [
          "These Tudors and colonials were built with plaster, hardwood, and tile work that tradespeople today rarely attempt. When we remodel a bathroom here, the new work has to sit comfortably beside the old: properly scaled vanities, tile set with care, and metalwork and lighting that match the gravity of the house.",
          "Underneath, we replace supply and drain lines that date to the twenties and thirties, add ventilation these homes never had, and waterproof to modern standards. The room looks period-correct and performs like new construction.",
          "Sourcing matters on these projects. We bring in tile, stone, and fittings that suit a house of this caliber, and when a client wants to match original details like a hex floor or cove base tile, we track down materials that read correctly. The craft is in making the new work feel inevitable.",
        ],
      },
      "huntington-woods": {
        lead: "Huntington Woods families stay for decades. We build bathrooms meant to last that long.",
        body: [
          "The 1930s and 1940s brick homes here usually have one full bath upstairs and maybe a half bath tucked somewhere inconvenient. Our most common projects in Huntington Woods are full rebuilds of that main bath and additions of a second full bath so the house keeps up with a growing family.",
          "We choose materials on a durability-first basis: porcelain tile, quality valves, proper ventilation, and heated floors that make Michigan winters more forgiving. Done once, done right, and good for the next few decades.",
          "Because owners here stay so long, we design for the decades ahead as well as the next one: curbless entries that work for every age, blocking set in the walls for future grab bars, and lighting layered for older eyes. None of it looks clinical, and all of it means the bathroom keeps fitting the family.",
        ],
      },
    },
  },
  {
    slug: "kitchen-remodeling",
    name: "Kitchen Remodeling",
    phrase: "kitchen remodel",
    metaDescription:
      "Kitchen remodeling in Metro Detroit. Open layouts, wall removal, custom cabinetry, and stone surfaces from a licensed design-forward renovation team. Free estimates.",
    intro: [
      "The kitchen carries more of daily life than any other room, and most Metro Detroit kitchens were designed for a family that cooked very differently. We remodel kitchens around how your household actually works: opening walls, rebuilding layouts, and installing cabinetry and surfaces that stand up to real use.",
      "Structural openings are where many kitchen projects live or die. Our crews handle wall removal, beam sizing, and the electrical, plumbing, and HVAC reroutes that come with it, permitted and inspected, so an open-concept kitchen is actually sound instead of just drywalled over.",
      "From first sketch to final hardware, one accountable team runs the project. Start with a free on-site estimate: we measure, talk through layout options, and give you a number based on your kitchen, not a template.",
    ],
    bullets: [
      "Wall removal and structural openings",
      "Custom cabinetry and stone surfaces",
      "Islands, storage & lighting design",
    ],
    faqs: [
      {
        q: "How long does a kitchen remodel take?",
        a: "Most full kitchen remodels run several weeks to a few months depending on scope. Cabinet lead times, structural work, and layout changes are the biggest variables. We give you a realistic timeline for your project at the free estimate, before anything starts.",
      },
      {
        q: "How much does a kitchen remodel cost in Metro Detroit?",
        a: "Kitchen costs vary more than any other room. Cabinetry, surfaces, appliances, and structural changes all swing the number. We give free on-site estimates so the price reflects your actual kitchen and scope rather than a guess from a price list.",
      },
      {
        q: "Can you remove the wall between my kitchen and living room?",
        a: "In most homes, yes. Many walls in Metro Detroit houses are load-bearing, which means proper beam sizing, permits, and inspection. We handle all of that in-house and confirm what's possible during the on-site estimate.",
      },
      {
        q: "Do you do partial kitchen updates or only full remodels?",
        a: "Both. Some clients want new cabinetry and counters in the existing layout; others want walls moved and the room rebuilt. We scope the project to what your kitchen actually needs.",
      },
    ],
    photoCategory: "kitchens",
    galleryFilter: "kitchens",
    cta: "Get a kitchen estimate",
    cityCopy: {
      detroit: {
        lead: "Detroit kitchens were built as workrooms, sealed off from the rest of the house. We open them up and make them the center of it.",
        body: [
          "In the city's colonials and Tudors, the kitchen sits behind a wall that the whole family now wants gone. Most of those walls carry load, so we size beams properly, pull city permits, and handle the electrical and duct reroutes that come with opening a 1920s floor plan.",
          "We also plan around what these houses hide: knob-and-tube circuits that must be replaced before a modern kitchen's appliance load, plaster that deserves patching by someone who knows how, and original flooring that can often be saved and blended.",
          "Every Detroit kitchen we build starts with an honest look at the panel and service. Induction ranges, double ovens, and modern refrigeration ask more of a house than 1920s wiring can give, and we scope the electrical work up front so there are no surprises mid-project. The result is a kitchen that works as hard as it looks.",
        ],
      },
      "boston-edison": {
        lead: "Boston-Edison kitchens were designed for staff, not for the family. A century later, that layout finally gets fixed.",
        body: [
          "These grand homes often have a warren of small rooms at the back: kitchen, pantry, maybe a maid's stair. Our work here typically combines those spaces into one generous kitchen while keeping the trim profiles, ceiling heights, and doorway proportions consistent with the rest of the house.",
          "Cabinetry is the make-or-break decision in a house like this. We spec custom work with inset doors and period-appropriate detailing, paired with stone and appliances that read as modern without breaking the home's character. Exterior alterations go through historic district review, which we manage.",
          "Lighting deserves special mention in these houses. Ten-foot ceilings and generous windows give us room for layered light: recessed where it should disappear, fixtures where they belong over islands and tables, and undercabinet light that makes the counters usable at night. It changes how the whole back of the house feels.",
        ],
      },
      ferndale: {
        lead: "A Ferndale bungalow kitchen has no square footage to waste. Good design here is a matter of inches.",
        body: [
          "We spend our Ferndale design time on storage and flow: ceiling-height cabinets, drawer bases instead of doors, and peninsulas that seat three without blocking the back door. When the dining room wall can come out, and it usually can with proper structural work, a small house suddenly lives much larger.",
          "These projects are also a chance to correct old grid wiring and undersized circuits, because a modern kitchen's appliances demand more than a 1940s panel planned for. We fold that work into the same permit and schedule.",
          "We also design for resale honesty in Ferndale, where houses trade often. A kitchen that photographs well matters, but a kitchen that inspects well matters more: permitted structural work, clean electrical, and ventilation that actually ducts outside. Buyers' inspectors notice, and so will you every day you live with it.",
        ],
      },
      "royal-oak": {
        lead: "Royal Oak kitchens feed people who could walk downtown to eat but mostly don't want to. We build kitchens worth staying in.",
        body: [
          "The typical project here is a 1940s or 1950s kitchen that was refaced once in the nineties and is now done for good: cabinets rebuilt from scratch, the wall to the dining room opened, an island added where the house allows, and lighting designed instead of inherited.",
          "Royal Oak lots are tight and neighbors are close, so we keep the site clean and the schedule honest. Permits run through the city, inspections included, and one crew is accountable from demolition through the last cabinet pull.",
          "Storage is where these kitchens win or lose. We plan drawer bases, pantry pull-outs, and appliance garages around how you actually cook, then use the ceiling height for cabinets that hold the things you touch twice a year. A Royal Oak kitchen does not have square footage to spare, so none of it gets wasted.",
        ],
      },
      birmingham: {
        lead: "In Birmingham, the kitchen is the room guests actually judge. Ours are built for that audience.",
        body: [
          "Projects here trend toward full custom: paneled appliances, stone with waterfall edges or honed finishes, dedicated coffee and bar zones, and islands scaled for both homework and hosting. The design phase is longer because the decisions deserve it.",
          "Under the surfaces, we hold the same standard: properly sized structural openings, clean electrical work, and ventilation that actually exhausts outside. A kitchen at this level should perform as well as it photographs.",
          "Appliance integration is its own discipline at this level: panel-ready refrigeration, ventilation engineered for serious ranges, and cabinetry built around the exact spec sheet of every unit. We coordinate those details before cabinets are ordered, because an eighth of an inch is the difference between built-in and boxed-in.",
        ],
      },
      "pleasant-ridge": {
        lead: "Pleasant Ridge kitchens sit in small historic homes with big expectations. We fit a lot of kitchen into these rooms.",
        body: [
          "The 1920s houses here rarely allow a sprawling addition, so the win comes from smarter layout: absorbing a butler pantry or breakfast nook, opening the dining wall with a properly engineered beam, and using every vertical inch for storage.",
          "We match new work to old: cabinet styles that suit the era, hardwood blended into original floors, and trim carried through so the kitchen stops feeling like the newest room in the house and starts feeling like it was always this good.",
          "These projects run through occupied homes on tight streets, and we manage them that way: deliveries scheduled, a clean site every evening, and a temporary kitchen set up so the household keeps functioning. Neighbors here notice how a crew behaves, and we treat that as part of the job.",
        ],
      },
      troy: {
        lead: "Troy's split-levels and colonials hide great kitchens behind 1970s walls. We take the walls down.",
        body: [
          "The signature Troy project is opening the kitchen to the family room and adding a real island, which these floor plans have room for once the right wall comes out. Beam sizing, permits, and rerouted mechanicals are part of nearly every one of these jobs, and we handle them in-house.",
          "With more generous footprints than the inner-ring suburbs, Troy kitchens support features that smaller homes cannot: walk-in pantries, double ovens, and islands with seating for four. We design to what the house allows rather than forcing a template.",
          "Islands are the heart of most Troy kitchens we build, and we size them honestly: seating with real knee room, landing zones beside the cooktop, and power where laptops and mixers actually get used. When the floor plan allows a walk-in pantry, we build that too, and the kitchen stops fighting for storage.",
        ],
      },
      "grosse-pointe": {
        lead: "A Grosse Pointe kitchen has to earn its place in a house full of original craftsmanship. Ours do.",
        body: [
          "We build kitchens here with inset custom cabinetry, substantial stone, and millwork profiles matched to the home's existing trim. In a Tudor or Georgian colonial, a big-box kitchen looks like a wrong note; the work has to be proportioned to the house.",
          "These homes also demand real mechanical planning: plaster walls conceal decades of wiring vintages, and ranges and ovens need capacity the original service never anticipated. We sequence that work so the finished kitchen is as sound as it is beautiful.",
          "Where original butler's pantries survive, we often restore rather than remove them, adding refrigeration and lighting while keeping the glass-front cabinets that make them special. It is the kind of decision that separates renovating a Grosse Pointe home from erasing one.",
        ],
      },
      "huntington-woods": {
        lead: "Huntington Woods kitchens serve households that plan to stay. We design for the next thirty years, not the next listing photo.",
        body: [
          "The brick homes here usually have a modest kitchen separated from the dining room by a wall that can come out with proper structural work. That single change, plus cabinetry designed for how the family actually cooks, transforms the main floor.",
          "Owners here choose finishes for longevity: painted custom cabinets that can be refreshed rather than replaced, durable stone, and hardwood that ties into the original floors. We build accordingly and pull permits on all applicable work.",
          "The families we work with here cook, and the kitchens show it: durable quartz and stone over precious surfaces, backsplashes that wipe clean, floors that shrug off cleats and paws. We help you choose finishes by how they will look after a decade of real use, not just on install day.",
        ],
      },
    },
  },
  {
    slug: "basement-finishing",
    name: "Basement Finishing",
    phrase: "basement finishing project",
    metaDescription:
      "Basement finishing in Metro Detroit. Guest suites, theaters, gyms, and income-ready spaces with egress, moisture control, and permits handled. Free estimates.",
    intro: [
      "An unfinished basement is the cheapest square footage you will ever add to your home. We finish basements across Metro Detroit into guest suites, theaters, gyms, bars, and income-ready in-law units, built on the two things that make or break a basement: moisture control and proper egress.",
      "Michigan basements have to be finished for Michigan conditions. That means addressing water management before the first stud goes up, insulating correctly, controlling sound, and installing code-compliant egress windows where bedrooms are planned. We handle the permits and inspections on every applicable job.",
      "Tell us what you want the space to do. The free on-site estimate covers layout options, egress and moisture requirements, and a number based on your actual basement.",
    ],
    bullets: [
      "Egress windows and permitting handled",
      "Moisture, insulation, and sound control",
      "Income-ready suite layouts",
    ],
    faqs: [
      {
        q: "Do I need an egress window to finish my basement?",
        a: "If the finished basement includes a bedroom, code requires a compliant egress window or door. We handle egress cuts, window installation, and the permit and inspection process as part of the project.",
      },
      {
        q: "What about moisture? My basement gets damp.",
        a: "Moisture is the first thing we evaluate, because finishing over a damp basement is money wasted. Depending on the cause, the fix ranges from grading and gutter corrections to interior drainage. We address it before finishing begins.",
      },
      {
        q: "How much does basement finishing cost in Metro Detroit?",
        a: "It depends on the size of the basement and what the space needs to do. A media room and an income-ready suite with a bathroom are very different projects. Every project starts with a free on-site estimate based on your actual basement.",
      },
      {
        q: "Can a finished basement work as a rental or in-law unit?",
        a: "Often, yes, with the right layout, egress, and in some municipalities additional requirements. We design income-ready suites and walk you through what your city requires.",
      },
    ],
    photoCategory: "basements",
    galleryFilter: "basements",
    cta: "Get a basement estimate",
    cityCopy: {
      detroit: {
        lead: "Detroit basements are honest spaces: solid, deep, and unfinished for a hundred years. We put them to work.",
        body: [
          "The city's older foundations, whether block or poured, generally offer real ceiling height and sound structure, but they were never meant to be lived in. Our Detroit projects start with water: grading, gutters, and where needed interior drainage, because finishing over a damp basement wastes every dollar that follows.",
          "James R. told us after his Detroit basement finish that his family uses the space every single day, which is the whole point. Suites, rec rooms, and gyms all start with the same fundamentals here: moisture handled, insulation done right, and egress cut where bedrooms are planned.",
          "Ceiling height decides a lot in these basements, and we design to protect it: mechanicals rerouted tight to the joists, slim-profile lighting, and flooring systems that add warmth without stealing inches. Where height is generous, as it often is in Detroit's older stock, the finished space feels like a true lower level rather than a basement.",
        ],
      },
      "boston-edison": {
        lead: "Under a Boston-Edison home sits a basement built like civic infrastructure. It deserves a finish plan to match.",
        body: [
          "These foundations are massive, and the basements often include original features like fruit cellars, boiler rooms, and servant work areas that reorganize beautifully into media rooms, wine storage, and guest quarters. The scale gives us more layout freedom than almost anywhere else in Metro Detroit.",
          "The engineering care goes into what these old systems left behind: steam pipe routing, aged drain tile, and masonry that wants repointing before it gets covered. We resolve all of it before finishes go in, with permits pulled through the city.",
          "We also respect what these basements were. Original details like brick piers, arched doorways, and heavy timber shelving can often be cleaned up and featured instead of hidden, giving the finished space a character a drywall box never has. It is the same preservation instinct we bring to the floors above.",
        ],
      },
      ferndale: {
        lead: "In a Ferndale bungalow, the basement is the only direction the house can grow. We treat it like a full addition.",
        body: [
          "Finishing the basement of a 950-square-foot bungalow can nearly double the living space, which is why this is one of our most requested Ferndale projects. The plan usually includes a family room, a full bath, laundry that stops being a cave, and often a guest room with a code-compliant egress window.",
          "These basements run tighter on ceiling height than newer suburbs, so we plan mechanicals carefully: rerouting ducts, boxing only what must be boxed, and choosing lighting that keeps the space feeling open.",
          "Egress is usually the gating question in Ferndale, and we answer it early: where the window can go, what the dig and cut involve, and what the city requires. Settled at the estimate stage, it lets the rest of the design proceed without a code surprise waiting at the end of the project.",
        ],
      },
      "royal-oak": {
        lead: "Royal Oak basements have been rec rooms, band rooms, and storage. We turn them into real square footage.",
        body: [
          "The typical Royal Oak project replaces a 1970s paneled rec room with a properly built space: moisture addressed first, real insulation instead of bare studs and paneling, sound control under the main floor, and a layout designed around how the family will actually use it.",
          "Bars and media walls are popular here, and so are guest suites with egress for visiting family. Permits and inspections run through the city, and we manage that process on every applicable job.",
          "Sound is the detail owners thank us for later. Insulated ceilings, solid doors, and isolated theater walls mean a movie downstairs does not compete with bedtime upstairs. It is inexpensive to do during construction and nearly impossible to retrofit, so we build it in from the start.",
        ],
      },
      birmingham: {
        lead: "A Birmingham basement should feel like the rest of the house, not the floor below it. That is the standard we build to.",
        body: [
          "Projects here go beyond the family room: full wet bars, glass-walled gyms, theaters with engineered sound control, and guest suites finished to the same level as the upstairs. Flooring, trim, and lighting are specified with the whole house in mind.",
          "The unglamorous work still comes first. We verify moisture management, insulate to modern standards, and handle egress and permits, because a luxury finish over a compromised basement is not luxury for long.",
          "Stairs set the tone for a basement at this level, so we rebuild them as part of most projects: open railings, proper lighting, and finishes continuous with the main floor. When the descent feels like part of the house, the whole level gets used the way it was designed to be.",
        ],
      },
      "pleasant-ridge": {
        lead: "Pleasant Ridge houses cannot sprawl outward, so the smart money goes down. We finish basements that live like main floors.",
        body: [
          "With compact lots and a historic streetscape, additions are difficult here, which makes the basement the practical path to more space. Our projects turn these 1920s foundations into family rooms, offices, and guest space with proper moisture control and insulation designed for old masonry.",
          "Low-clearance mechanicals are the puzzle in houses of this age. We reroute what can move, conceal what cannot, and design lighting and ceiling treatments that make modest height feel intentional.",
          "We plan these projects around the house's history as much as its space. Decades of furnace swaps and rerouted ductwork leave odd soffits and chases behind, and we untangle what we can, then design the ceiling deliberately so what remains looks like a choice. The difference shows in every sightline.",
        ],
      },
      troy: {
        lead: "Troy basements are big, dry, and blank. They are the easiest square footage you will ever add.",
        body: [
          "The 1960s through 1980s foundations here typically offer generous footprints, decent height, and fewer moisture surprises than the older suburbs, which lets the budget go toward the space itself: theaters, gyms, bars, playrooms, and guest suites with proper egress.",
          "Because many Troy homes back to larger yards, daylight windows and walkout conditions are more common, and we design around them. Permits and inspections run through the City of Troy, handled by us end to end.",
          "Basement bars and kitchenettes are the most requested feature in Troy, and we build them plumbed, vented, and wired properly: real drainage, dedicated circuits, and ventilation where a cooktop is planned. A bar built like a kitchen stays a feature instead of becoming a problem.",
        ],
      },
      "grosse-pointe": {
        lead: "Grosse Pointe basements were built for coal and staff. We rebuild them for family.",
        body: [
          "Under these stately homes you find generous foundations divided into old utility rooms, and the renovation is as much reorganization as finishing: removing obsolete partitions, addressing vintage drain tile and masonry, and then building wine rooms, media spaces, and guest quarters worthy of the house above.",
          "Moisture management gets particular attention near the lake, and we verify it before a single stud goes up. Finishes follow the home's character: proper trim, quality doors, and lighting that avoids the dropped-ceiling gloom these basements suffered for decades.",
          "Climate control gets engineering attention near the lake: dehumidification designed in, insulation appropriate to old masonry, and HVAC balanced so the lower level holds the same comfort as the rest of the house through a humid August or a frozen January. Comfort is what makes the space actually get used.",
        ],
      },
      "huntington-woods": {
        lead: "A Huntington Woods basement finish is a family-room project first. We build the space the household actually needs.",
        body: [
          "The 1930s and 1940s brick homes here have sturdy but modest basements, and the best plans are focused ones: a family room, a full bath, organized storage, and often a quiet office now that someone in the house works from home.",
          "We correct the era's standard issues along the way: minor seepage resolved before framing, insulation where there was none, and a layout that hides the mechanicals without strangling access to them. Permits are pulled on all applicable work.",
          "Storage stays in the plan on every Huntington Woods basement. Finishing the space does not mean losing what the basement used to hold, so we design real storage rooms with shelving, a utility area with workspace, and access panels that keep every valve and cleanout reachable. Practical and finished can be the same basement.",
        ],
      },
    },
  },
  {
    slug: "full-home-renovations",
    name: "Full Home Renovations",
    phrase: "whole-home renovation",
    metaDescription:
      "Full home renovations in Metro Detroit. Layout, systems, and finishes modernized end to end while keeping the character worth keeping. Licensed & insured. Free estimates.",
    intro: [
      "Metro Detroit has some of the best housing stock in the country: brick colonials, Tudors, and mid-century homes with materials you cannot buy anymore. What they lack is modern layouts, systems, and insulation. Our full home renovations modernize these houses end to end while keeping the character worth keeping.",
      "A whole-home project is a systems project as much as a finishes project: electrical service and wiring, plumbing, HVAC, insulation, and often structural reconfiguration. Because our own crews do the work, one accountable team carries the project from demolition through final paint, with no coordination gaps between trades.",
      "These projects reward careful planning. We start with a free walkthrough of the whole house, help you define scope and phasing, and give you a number built from your home's actual condition.",
    ],
    bullets: [
      "Electrical, plumbing, and HVAC updates",
      "Layout reconfiguration and additions",
      "Historic-character preservation",
    ],
    faqs: [
      {
        q: "Can we live in the house during a full renovation?",
        a: "It depends on scope and phasing. Some projects can be sequenced so part of the house stays livable; a full gut usually cannot. We talk through phasing honestly at the estimate so you can plan.",
      },
      {
        q: "How do you handle older homes with historic character?",
        a: "Carefully. We modernize systems and layout while preserving, and where needed restoring, the trim, masonry, and proportions that give these houses their value. Where a home sits in a designated historic district, we work within the local review requirements.",
      },
      {
        q: "How much does a full home renovation cost?",
        a: "Scope drives everything. A cosmetic whole-house refresh and a gut renovation with systems replacement are entirely different projects. The free on-site walkthrough is where we define scope together and put a real number to it.",
      },
      {
        q: "Do you handle design as well as construction?",
        a: "Yes. Layout, material, and lighting decisions are part of the project, with a design-forward eye and one point of contact from start to finish.",
      },
    ],
    photoCategory: "stairs",
    galleryFilter: "stairs",
    cta: "Plan a full renovation",
    cityCopy: {
      detroit: {
        lead: "Detroit's houses were built to last centuries. A full renovation gives them the second one.",
        body: [
          "Renovating a Detroit colonial or Tudor end to end means new electrical service, plumbing, HVAC, and insulation inside masonry and framing that today's budgets could never reproduce. We gut what has failed, keep what has not, and restore the plaster, trim, and floors that make these houses irreplaceable.",
          "We also know the city's process: permits, inspections, and where applicable the historic district rules that govern exterior work. One crew carries the project from structural work to final paint, which is how a hundred-year-old house comes back on schedule.",
          "Phasing is where these projects are won. We sequence structural work, systems, plaster, and finishes so trades never undo each other's work, and we book inspections ahead so the schedule never waits on one. A whole-house renovation in Detroit rewards a crew that has done it in houses like yours, and ours has.",
        ],
      },
      "boston-edison": {
        lead: "Renovating a Boston-Edison home is stewardship. We modernize everything while looking like we touched nothing.",
        body: [
          "These are some of Detroit's great houses, and a full renovation here runs on two tracks at once: complete systems replacement behind the walls, and faithful preservation in front of them. Leaded glass, quarter-sawn oak, and original plasterwork get protected and restored, not demolished.",
          "Layout changes concentrate where the old service spaces were: kitchens opened and enlarged, bathrooms added where a house of this size plainly needs them, and third floors turned into usable suites. Exterior work proceeds within the historic district review process, which we manage.",
          "Documentation matters in houses of this significance. We photograph and measure before demolition, catalog hardware and millwork that comes off for restoration, and keep a record of what sits behind the walls for the next steward of the house. It is extra care that costs little and preserves a great deal.",
        ],
      },
      ferndale: {
        lead: "A whole-home renovation in Ferndale turns a starter bungalow into the house you never have to leave.",
        body: [
          "The full-house projects we run here usually combine several moves: the kitchen opened to the dining room, the single bath rebuilt and a second one added, the attic converted to a primary suite, and the basement finished. Together they roughly double what the house can do without changing its footprint.",
          "Systems come with it. Most Ferndale bungalows still carry some mix of vintage wiring, galvanized plumbing, and casual insulation, and a whole-home scope is the efficient moment to replace all of it under one permit set and one schedule.",
          "Budget conversations here are candid. We help owners sequence the work by what protects the house first: roof, water management, and systems ahead of finishes, so every dollar builds on a sound foundation. When phases are planned honestly, a bungalow transformation stays affordable without ever being cut-rate.",
        ],
      },
      "royal-oak": {
        lead: "Royal Oak owners love their neighborhood more than their floor plan. A full renovation fixes the floor plan.",
        body: [
          "The classic project here takes a 1940s house and reworks the entire main floor: kitchen opened to dining and living, a proper mudroom carved out, a first-floor half bath added, and upstairs bedrooms and bath rebuilt. The house keeps its street presence and gains a modern interior.",
          "Because these projects touch every room, communication is the difference between a renovation and an ordeal. You get one point of contact, a schedule you can hold us to, and permits and inspections run through the city by us from start to finish.",
          "Energy performance is a quiet win in these renovations. Air sealing, insulation brought to modern standards, right-sized HVAC, and new windows where they earn their cost make a 1940s house genuinely comfortable, and the utility bills show it. It is the least visible part of the project and one of the most felt.",
        ],
      },
      birmingham: {
        lead: "Birmingham whole-home projects aim past renovation toward transformation. We deliver both the vision and the engineering under it.",
        body: [
          "Full renovations here frequently include additions: expanded kitchens, primary suites, and reworked rear elevations that open to the yard. That means foundations, steel, and structural engineering alongside the finish work, all run by one accountable team.",
          "The finish standard is the region's highest, and the systems standard should match it. We replace electrical, plumbing, and HVAC to support the way the finished house will actually be used, and we design lighting as carefully as the rooms it serves.",
          "We manage the design process as carefully as the build: material boards, lighting plans, and fixture schedules resolved before demolition, with one point of contact keeping decisions moving. Owners here run busy lives, and the project should respect their calendar as much as their house.",
        ],
      },
      "pleasant-ridge": {
        lead: "Pleasant Ridge rewards owners who renovate the whole house at once. We keep the character and replace everything that fails.",
        body: [
          "A full renovation in this historic enclave typically preserves the street-facing charm entirely while reworking the interior: opened main floor, rebuilt kitchen and baths, converted attic space, and a finished basement, sequenced as one project instead of five separate disruptions. Maria and Devon T. hired us for exactly this in Pleasant Ridge and said we turned their chopped-up 1940s layout into the open, light-filled home they always pictured, keeping them in the loop the whole way.",
          "The houses date to the 1920s and 1930s, so systems replacement is not optional at this scope. We rewire, replumb, insulate, and update heating and cooling in one coordinated pass, with the city's permits and inspections handled throughout.",
          "The historic district review covers exterior changes in Pleasant Ridge, and we carry that process for our clients: drawings prepared, materials specified to the guidelines, and the timeline planned around review dates. Inside, the house can become entirely new while the street sees the neighborhood it has always been.",
        ],
      },
      troy: {
        lead: "Troy's 1970s houses have great bones and dated everything else. A full renovation resets the whole house at once.",
        body: [
          "The whole-home scope here is usually about openness and light: walls out between kitchen and family room, a widened stair opening, new windows, and a primary bath and closet built to modern expectations. These floor plans absorb change well because the structure is straightforward.",
          "Renovating all at once beats a decade of piecemeal projects on both cost and result: one design pass, one permit process with the City of Troy, one mobilization, and finishes that match through the whole house instead of by era.",
          "These projects often include the outside of the house as well: new siding and stone, a rebuilt entry, and garage doors that stop apologizing for the decade they were made in. A 1970s Troy house can read as a current one, inside and out, without changing its footprint.",
        ],
      },
      "grosse-pointe": {
        lead: "A Grosse Pointe renovation must honor what the original builders achieved. We modernize these homes without diminishing them.",
        body: [
          "Full projects here balance restoration and renovation room by room: slate, plaster, paneling, and leaded glass conserved and repaired, while kitchens, baths, and systems are rebuilt completely. The judgment about which is which is the real skill, and it is where we spend our planning time.",
          "These houses also carry decades of layered mechanical history, from steam heat to window units to partial retrofits. We rationalize all of it into modern HVAC, wiring, and plumbing designed around the house rather than punched through it.",
          "Craftsmen matter most on houses like these, and ours have the patience the work demands: plaster repaired in place, hardwood woven into original floors, and paint and stain finishes built up the slow way. The house sets the pace of the finish work, and we let it.",
        ],
      },
      "huntington-woods": {
        lead: "In Huntington Woods, a full renovation is a decision to stay for good. We build houses that reward it.",
        body: [
          "The brick colonials here respond beautifully to a comprehensive scope: main floor opened where structure allows, kitchen and baths rebuilt, a family-room addition off the back where the lot permits, and the basement finished as part of the same plan.",
          "Because families here measure their stay in decades, we spec for the long run: durable finishes, systems sized correctly rather than minimally, and insulation that finally brings a 1940s house up to Michigan winters. Permits and inspections are handled on every applicable portion.",
          "School calendars run these projects, so we plan around them: the loudest phases in summer, the house sealed and livable by fall, and a schedule the family can actually hold on to. A renovation measured in decades of use should not be rushed through the months it takes to build.",
        ],
      },
    },
  },
  {
    slug: "flooring-tile",
    name: "Flooring & Tile",
    phrase: "flooring or tile project",
    metaDescription:
      "Hardwood flooring, large-format tile, and heated floor systems installed with precision across Metro Detroit. Licensed & insured. Free estimates.",
    intro: [
      "Floors are where craftsmanship shows. We install and refinish hardwood, set large-format porcelain and mosaic tile, and build heated floor systems across Metro Detroit. It is the detail work that separates a good renovation from a great one.",
      "Michigan homes move with the seasons, and flooring has to be installed for it: correct acclimation, flat substrates, uncoupling membranes under tile, and expansion detailing that keeps a floor tight through winter after winter.",
      "Whether it is one room or the whole main floor, the project starts with a free on-site estimate and honest advice about what your subfloor and budget actually support.",
    ],
    bullets: [
      "Hardwood install and refinishing",
      "Large-format and mosaic tile work",
      "Heated floor systems",
    ],
    faqs: [
      {
        q: "Can my original hardwood be refinished instead of replaced?",
        a: "Often, yes. Much of Metro Detroit's older housing stock has solid hardwood that can be sanded and refinished beautifully at a fraction of replacement cost. We assess board thickness and condition at the estimate and tell you straight which route makes sense.",
      },
      {
        q: "Do heated floors work under tile and wood?",
        a: "Heated systems pair best with tile and some engineered products. We spec the right system for the floor covering and the room. Bathrooms and mudrooms are the most popular applications in Michigan.",
      },
      {
        q: "What's the advantage of large-format tile?",
        a: "Fewer grout lines and a cleaner, more modern look. Large-format tile is unforgiving of flatness and installation shortcuts, which is exactly why installation quality matters.",
      },
    ],
    photoCategory: "fireplace",
    galleryFilter: "fireplace",
    cta: "Get a flooring estimate",
    cityCopy: {
      detroit: {
        lead: "Under decades of carpet and paint, Detroit houses hide some of the best hardwood in Michigan. We bring those floors back.",
        body: [
          "Oak and maple laid a century ago is usually still there in Detroit's colonials and bungalows, buried under the layers the decades added. We assess board thickness and repair scope honestly, weave in salvaged boards where rooms were altered, and sand and finish to a standard that makes the original floor the best feature of the house.",
          "Tile work here concentrates in kitchens, baths, and entries, where a hundred winters of boots have beaten the old surfaces. We set porcelain and mosaic over properly prepared substrates with uncoupling membranes, because a Michigan freeze-thaw house moves, and tile has to be installed for it.",
          "Flooring rarely travels alone: it lands inside kitchen, bath, and whole-house projects. Because our crews handle those scopes too, the floor goes in at the right stage of the job rather than as an afterthought squeezed in around finished cabinets.",
        ],
      },
      ferndale: {
        lead: "In a Ferndale bungalow, flooring choices carry the whole look of the house. We help you choose once and choose well.",
        body: [
          "Small houses show their floors everywhere, so consistency matters: one species and finish running through the main rooms makes a bungalow feel bigger than it measures. Where original oak survives, refinishing is usually the smart money, and we tell you straight when it is not.",
          "Bathrooms and kitchens here are compact, which makes tile pattern and scale decisions matter more, not less. We lay out mosaics and large-format tile to suit small rooms, run heated floors where a bungalow's single bath earns the upgrade, and waterproof like the room will be used hard, because it will.",
          "A lot of our Ferndale flooring work rides inside bigger projects, attic conversions and basement finishes included. Planning the floors with the whole project keeps transitions clean between old rooms and new ones, and keeps heights aligned so doorways and stairs land right.",
        ],
      },
      "royal-oak": {
        lead: "Royal Oak floors have hosted fifty years of refinish-or-replace debates. We settle them honestly, room by room.",
        body: [
          "The hardwood in Royal Oak's postwar houses is usually solid oak worth saving, and a sand and refinish transforms it for a fraction of replacement cost. Where previous owners sanded aggressively or patched with mismatched species, we lay out the honest options: repair and blend, or replace and match the era.",
          "Tile projects here center on bathrooms and mudrooms, and heated floor systems have become the default request in both. We spec the system to the room and the covering, wire it on its own circuit, and set tile flat over membranes so grout lines stay tight through Michigan's seasonal swings.",
          "We also fix the sins of past quick flips: floating floors over failing subfloors, tile set on bare plywood, transitions that trip. The repair starts at the substrate, which is not the glamorous part, but it is why our floors stay quiet and flat after the seasons change.",
        ],
      },
      birmingham: {
        lead: "Birmingham interiors are built on their surfaces. Floors here have to be flawless, because everything else stands on them.",
        body: [
          "Wide-plank hardwood, herringbone and chevron layouts, and large-format stone and porcelain are the standing requests in Birmingham, and all of them are unforgiving of preparation shortcuts. We flatten substrates to spec before a single board or tile goes down, because at this finish level the floor either reads perfect or it reads wrong.",
          "Heated floors run through most of our Birmingham bath and mudroom work, and increasingly under kitchen tile as well. We design the systems room by room, with programmable controls and layouts that cover where feet actually land, so the comfort is complete instead of approximate.",
          "Material sourcing gets real attention: stone with movement matched across a floor, hardwood culled and racked before installation, and samples reviewed in the room's own light before we commit. The difference between good and exceptional flooring is decided before installation day, and we spend the time there.",
        ],
      },
      troy: {
        lead: "Troy houses give flooring projects a head start: flat, dry, and structurally simple. We make the most of it.",
        body: [
          "The newer housing stock here means plywood subfloors and predictable framing, so projects move quickly from decision to installation. Most of our Troy work replaces worn carpet and dated strip flooring with hardwood or quality engineered product run continuously through the main floor, which suits these open plans.",
          "Kitchens and baths get porcelain set over uncoupling membrane, and mudrooms, the hardest-working floor in a Troy house, get tile chosen for grit and salt with heated systems where the family wants winter mornings softened. We build the floor for how Michigan actually treats it.",
          "Because many of these houses are mid-renovation when we arrive, we coordinate flooring with the larger scope: heights planned so new hardwood meets existing stairs correctly, transitions minimized as walls come out, and installation sequenced after the dusty trades finish. The floor is the last thing done and the first thing seen.",
        ],
      },
      "grosse-pointe": {
        lead: "The floors in a Grosse Pointe home are original craftsmanship underfoot. Our job is to honor them or match them.",
        body: [
          "Quarter-sawn oak, walnut borders, and inlaid patterns survive in many of these houses, and restoring them is specialist work: careful sanding that respects wear patterns, repairs woven from period-correct stock, and finishes that deepen the wood instead of plasticizing it. We treat these floors as the irreplaceable material they are.",
          "Where new floors join old, in kitchen expansions and additions, we mill and finish to match, aligning board width, grain, and stain so the seam between decades disappears. Stone and tile follow the same standard, with marble and mosaics set to suit the house's period rooms.",
          "Radiant heat fits these homes well, particularly in baths and garden-level rooms where old masonry holds the chill. We engineer the systems around existing structure and finishes, warming the rooms without disturbing what makes them worth preserving.",
        ],
      },
    },
  },
  {
    slug: "roofing",
    name: "Roofing",
    phrase: "roofing project",
    metaDescription:
      "Roof replacement and repair in Metro Detroit. Tear-off, decking repair, flashing, and ventilation done to spec by a licensed, insured local crew. Free estimates.",
    intro: [
      "A roof in Michigan takes freeze-thaw cycles, ice dams, wind, and summer heat, and it protects everything else you have invested in the house. We replace and repair roofs across Metro Detroit with the full scope done to spec: tear-off, decking repair, underlayment, flashing, and ventilation.",
      "Ventilation and flashing are where roofs actually fail. We correct undersized intake and exhaust ventilation, the root cause of most ice damming, and we re-flash chimneys, valleys, and walls properly instead of caulking over problems.",
      "If you have a leak, storm damage, or a roof at the end of its life, we will assess it honestly at a free estimate and tell you whether repair or replacement is the right call.",
    ],
    bullets: [
      "Complete tear-off and replacement",
      "Decking, flashing, and ventilation repair",
      "Storm and leak damage assessments",
    ],
    faqs: [
      {
        q: "How do I know if I need a repair or a full replacement?",
        a: "Age, the extent of the damage, and the condition of the decking underneath decide it. We inspect the roof at a free estimate and give you an honest recommendation: repair when repair genuinely solves it, replacement when it does not.",
      },
      {
        q: "What causes ice dams and can you prevent them?",
        a: "Ice dams come from heat escaping into the attic and melting snow that refreezes at the eaves. The durable fix is correct insulation and ventilation, plus ice-and-water shield at the eaves during replacement. All of that is standard on our roofs.",
      },
      {
        q: "Do you handle insurance claims for storm damage?",
        a: "We document damage thoroughly during the assessment and provide the detail your insurer needs. You deal with one accountable local crew, not a storm-chasing outfit.",
      },
    ],
    photoCategory: "exterior",
    galleryFilter: "exterior",
    cta: "Get a roofing estimate",
    cityCopy: {
      detroit: {
        lead: "Detroit roofs carry steep pitches, old chimneys, and a century of patches. We replace them the right way, down to the deck.",
        body: [
          "The city's colonials and Tudors have complicated roofs: steep slopes, dormers, valleys, and masonry chimneys that all demand real flashing work. Our tear-offs go to the deck, replace what a hundred years has rotted, and rebuild valleys and chimney flashing in metal instead of another layer of tar.",
          "Ventilation is the fix most Detroit attics have never had. We balance intake at the eaves with exhaust at the ridge, which stops the ice dams that stain plaster and rot cornices, and we install ice-and-water shield at the eaves and in valleys as standard.",
          "We work storm damage honestly: documented assessments with photos, straight talk about repair versus replacement, and detail your insurer can act on. One local crew, accountable after the job the same way we were before it.",
        ],
      },
      ferndale: {
        lead: "A Ferndale bungalow roof is simple geometry that still fails in the usual Michigan ways. We build it to stop.",
        body: [
          "Low-slung bungalow roofs concentrate their problems at the eaves: ice dams from warm, under-vented attics, and gutters that back water under the first courses. Our replacements pair balanced ventilation with ice-and-water shield run well past the warm-wall line, which is the durable fix rather than the heat-cable bandage.",
          "Many Ferndale attics have been converted to living space, which changes how the roof must breathe. We plan insulation and ventilation together on these houses so the finished attic stays comfortable and the shingles stop cooking from below.",
          "Roofs here are modest in size, and we treat them that way: an honest assessment, a clear scope with decking allowances stated up front, and a crew that leaves the yard clean and magnet-swept. Neighbors notice roofing crews, for better or worse, and we intend it to be better.",
        ],
      },
      "royal-oak": {
        lead: "Royal Oak's postwar roofs are on their third or fourth cycle. We break the pattern of covering problems over.",
        body: [
          "By the time we arrive, many of these roofs carry a second layer and a history of spot repairs. We strip to the deck, replace the sheets the layers hid, and rebuild the roof as a system: underlayment, flashing, ventilation, and shingles specified together instead of shingles alone.",
          "Bath fans venting into the attic are almost standard in Royal Oak houses, and they quietly ruin decking from below. Replacement day is when we fix it, ducting fans to the exterior and correcting attic airflow, so the new roof's decking stays dry from both sides.",
          "We schedule around real life: clear start dates, protection for landscaping and drives, same-day cleanup, and a walkthrough when it is done. A roof replacement should be one loud day or two, not a season of a dumpster in the driveway.",
        ],
      },
      birmingham: {
        lead: "Birmingham roofs are architecture, not just weather protection. We build them to the standard the street expects.",
        body: [
          "Steeper pitches, complex massing, and premium shingle profiles define roofing here. We install architectural and designer shingles with the details these roofs demand: open metal valleys, matched hip and ridge treatment, and flashing fabricated for the house rather than forced onto it.",
          "Copper and metal accents over bays, porticos, and dormers are part of many Birmingham roofs, and we integrate them properly with the shingle field. Gutters get sized and placed as part of the design, because water management on a roof this articulated is engineering, not accessory.",
          "The mechanics still rule: balanced ventilation, ice-and-water shield at eaves and valleys, and decking replaced wherever it has softened. A beautiful roof that ices up in February is a failure, so we build for the winter first and the curb second.",
        ],
      },
      troy: {
        lead: "Troy's roofs from the 1970s through the 1990s are aging out on schedule. We replace them before they fail, not after.",
        body: [
          "These houses were often shingled with the economical products of their era, and after a few cycles the decking, flashing, and ventilation all deserve a fresh look. Our replacements treat the roof as a system, with tear-off to the deck, upgraded underlayment, and ventilation balanced to the attic's actual volume.",
          "Hail and wind move through Oakland County most years, and we assess storm damage honestly: what is cosmetic, what is functional, and what your insurer needs to see. When a repair genuinely solves it, we say so.",
          "Troy's larger footprints mean larger roof planes, which shows in both material and labor. We quote from measurements, state decking allowances up front, and stage the job so most homes are torn off and shingled in a day or two, cleaned up and magnet-swept behind us.",
        ],
      },
      "grosse-pointe": {
        lead: "Grosse Pointe roofs were built with slate, tile, and cedar in mind. Replacing or repairing them takes matching judgment.",
        body: [
          "Some of these homes still carry original slate and tile, and where they do, repair and restoration are often better answers than replacement. We assess honestly: fastener and flashing failures can be corrected while the field material soldiers on for decades more.",
          "Where replacement is right, we work with premium architectural and designer shingles that respect the original roof's visual weight, and we rebuild the details these roofs depend on near the lake's weather: copper valleys, chimney flashing, and properly lined built-in gutters.",
          "Mature trees and lake-effect wet mean these roofs live a harder life than their pitch suggests. We correct ventilation, clear the way for real drainage, and detail the eaves against ice, then leave the grounds the way we found them, which in Grosse Pointe is a standard of its own.",
        ],
      },
    },
  },
];

export interface SeoCity {
  slug: string;
  name: string;
  county: string;
}

export const seoCities: SeoCity[] = [
  { slug: "detroit", name: "Detroit", county: "Wayne County" },
  { slug: "boston-edison", name: "Boston-Edison", county: "Wayne County" },
  { slug: "ferndale", name: "Ferndale", county: "Oakland County" },
  { slug: "royal-oak", name: "Royal Oak", county: "Oakland County" },
  { slug: "birmingham", name: "Birmingham", county: "Oakland County" },
  { slug: "pleasant-ridge", name: "Pleasant Ridge", county: "Oakland County" },
  { slug: "troy", name: "Troy", county: "Oakland County" },
  { slug: "grosse-pointe", name: "Grosse Pointe", county: "Wayne County" },
  { slug: "huntington-woods", name: "Huntington Woods", county: "Oakland County" },
];

export function getService(slug: string): SeoService | undefined {
  return seoServices.find((s) => s.slug === slug);
}

export function getCity(slug: string): SeoCity | undefined {
  return seoCities.find((c) => c.slug === slug);
}

export const cityPageServices = seoServices.filter((s) => s.cityCopy);

/** JSON.stringify with `<` escaped, per the Next.js JSON-LD guidance. */
export function jsonLd(obj: object): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

export function serviceJsonLd(service: SeoService, city?: SeoCity): object {
  const url = city
    ? `${site.url}/services/${service.slug}/${city.slug}`
    : `${site.url}/services/${service.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: city ? `${service.name} in ${city.name}, MI` : service.name,
    serviceType: service.name,
    description: service.metaDescription,
    url,
    // References the sitewide GeneralContractor node declared in app/layout.tsx
    // instead of re-declaring a duplicate business entity per page.
    provider: { "@id": `${site.url}/#business` },
    areaServed: city
      ? { "@type": "City", name: `${city.name}, MI` }
      : { "@type": "AdministrativeArea", name: "Metro Detroit, MI" },
  };
}

export function faqJsonLd(faqs: ServiceFaq[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(
  crumbs: { name: string; path: string }[],
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${site.url}${c.path}`,
    })),
  };
}
