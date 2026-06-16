/* ------------------------------------------------------------------ */
/*  Eduardo Mitelman — Archive index data                              */
/*                                                                     */
/*  DRAFT — replace these placeholder entries with your real work.    */
/*  Format per item:                                                   */
/*    brand    -> client / program name (shown in the list rows)       */
/*    title    -> project name (shown as the large display title)      */
/*    director -> your role / credit (shown under the title)           */
/*    media    -> optional: "images/<file>.webp" (plate background)    */
/*    focal    -> optional: CSS background-position (default center)   */
/*                                                                     */
/*  The engine takes any number of items — Roman numerals, plates      */
/*  and scroll length adjust automatically.                            */
/* ------------------------------------------------------------------ */

const ARCHIVE = [
  /* Brand & identity systems */
  { brand: "Barça Miel",          title: "Barça Miel",                    director: "Branding and Ai Direction", media: "images/barca_miel.webp" },
  { brand: "StartUp Nation Central", title: "StartUp Nation Central",       director: "Branding, UX / UI", media: "images/startup-nation-central.webp" },
  { brand: "Questar",             title: "Questar",                      director: "Branding, UX, UI", media: "images/questar.webp" },
  { brand: "Amiad",               title: "Amiad",                        director: "Web UX / UI / DEV", media: "images/amid.webp" },
  { brand: "Manna Irrigation",    title: "Manna Irrigation",              director: "Branding, Identity, UX, UI", media: "images/manna-irrigation.webp" },
  { brand: "Bloom Holding UAE",   title: "Bloom Holding UAE",             director: "Branding, Social Media", media: "images/bloom.webp" },
  { brand: "Playermaker",         title: "Playermaker",                  director: "Branding, UX, UI", media: "images/playermaker.webp" },
  { brand: "SNC Playbook",        title: "SNC Playbook",                 director: "Graphic Design, Illustration", media: "images/snc-playbook.webp" },
  { brand: "GIV Solutions",       title: "GIV Solutions",                director: "Branding, UX, UI", media: "images/givsolutions.webp" },
  { brand: "Alexander Schneider", title: "Alexander Schneider",           director: "Branding, UX, UI", media: "images/alexander.webp" },
  { brand: "Mercado Central",     title: "Wayfinding & Voice",            director: "Design Direction" },
  { brand: "North Harbor",        title: "Maritime Editorial",            director: "Design Direction" },
  { brand: "Galeria Uno",         title: "Exhibition Identity",           director: "Design Direction" },
  { brand: "Foundry Works",       title: "Industrial Typography",         director: "Design Direction" },
  { brand: "Maison Petite",       title: "Quiet Luxury Refresh",          director: "Design Direction" },

  /* Campaigns */
  { brand: "Velvet Hour",         title: "The Slow Launch",               director: "Creative Direction" },
  { brand: "Solstice",            title: "Summer Editions",               director: "Creative Direction" },
  { brand: "Linea",               title: "Thirty Days of Form",           director: "AI Creative Strategy" },
  { brand: "Botanica",            title: "Grown, Not Generated",          director: "AI Creative Strategy" },
  { brand: "Night Market",        title: "City After Dark",               director: "Creative Direction" },
  { brand: "Form & Field",        title: "Harvest Campaign",              director: "AI Creative Strategy" },
  { brand: "Mira",                title: "Mirror Portraits",              director: "AI Creative Strategy" },
  { brand: "Paper Plane",         title: "Departures",                    director: "Creative Direction" },
  { brand: "Cobalt",              title: "Blue Hour Series",              director: "AI Creative Strategy" },
  { brand: "Anthem",              title: "Voices Campaign",               director: "Creative Direction" },

  /* Courses & workshops */
  { brand: "UX Foundations",      title: "Hands-On UX, Cohort I",         director: "Education" },
  { brand: "UX Foundations",      title: "Hands-On UX, Cohort II",        director: "Education" },
  { brand: "AI Studio",           title: "Prompt to Production",          director: "Education" },
  { brand: "AI Studio",           title: "Creative Systems with AI",      director: "Education" },
  { brand: "Design Critique Lab", title: "Seeing Before Making",          director: "Education" },
  { brand: "Brand Sprint",        title: "Identity in Five Days",         director: "Education" },
  { brand: "Portfolio Clinic",    title: "Show the Thinking",             director: "Education" },
  { brand: "Masterclass",         title: "From Brief to System",          director: "Education" },

  /* Product & UX */
  { brand: "Ledger",              title: "Finance Without Fear",          director: "UX / UI" },
  { brand: "Atlas Health",        title: "Patient-First Flows",           director: "UX / UI" },
  { brand: "Driftwood",           title: "Booking, Simplified",           director: "UX / UI" },
  { brand: "Signal",              title: "A Calmer Dashboard",            director: "UX / UI" },
  { brand: "Habitat",             title: "Onboarding Redesign",           director: "UX / UI" },
  { brand: "Loop",                title: "Community Mechanics",           director: "UX / UI" },
  { brand: "Archive Engine",      title: "This Very Website",             director: "UX / UI" },
  { brand: "Fieldnotes",          title: "Research Companion",            director: "UX / UI" },

  /* Systems & frameworks */
  { brand: "Method",              title: "The UNR Framework",             director: "Creative Systems" },
  { brand: "Method",              title: "Concept, Structure, Output",    director: "Creative Systems" },
  { brand: "Toolkit",             title: "Reusable Brief Library",        director: "Creative Systems" },
  { brand: "Toolkit",             title: "Critique Protocols",            director: "Creative Systems" },
  { brand: "Playbook",            title: "AI in the Design Room",         director: "Creative Systems" },
  { brand: "Playbook",            title: "Teaching by Making",            director: "Creative Systems" },
];

/* Tonal media plates — curated paper-and-ink range only.
   Mid grays are excluded on purpose: the index layer uses
   mix-blend-mode: difference, so plates must stay clearly
   light (sand family) or clearly deep (ink family). */
const TONES = [
  { bg: "#1B1917", dark: true  },
  { bg: "#E8E3DA", dark: false },
  { bg: "#26221E", dark: true  },
  { bg: "#EFEBE3", dark: false },
  { bg: "#141312", dark: true  },
  { bg: "#DFD8CB", dark: false },
  { bg: "#2E2A24", dark: true  },
  { bg: "#E4DFD6", dark: false },
  { bg: "#1F1C1A", dark: true  },
  { bg: "#ECE7DE", dark: false },
  { bg: "#171614", dark: true  },
  { bg: "#D9D2C4", dark: false },
];
