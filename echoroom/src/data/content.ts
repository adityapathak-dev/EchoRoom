/**
 * EchoRoom content pool.
 *
 * 8 topics × 4 items each (2 per stance A/B) = 32 items.
 * Every topic presents two opposing framings so the algorithm
 * can amplify one while hiding the other.
 */

// ── Types ──────────────────────────────────────

export interface Topic {
  id: string;
  label: string;
  icon: string;
}

export type Stance = "A" | "B";

export interface ContentItem {
  id: number;
  topic: string;
  stance: Stance;
  stanceLabel: string;
  headline: string;
  blurb: string;
}

// ── Topics ─────────────────────────────────────

export const TOPICS: Topic[] = [
  { id: "phones", label: "Phones in School", icon: "\u{1F4F1}" },
  { id: "ai", label: "AI in the Classroom", icon: "\u{1F916}" },
  { id: "fashion", label: "Fast Fashion", icon: "\u{1F455}" },
  { id: "gaming", label: "Gaming & Mental Health", icon: "\u{1F3AE}" },
  { id: "climate", label: "Climate Action", icon: "\u{1F30E}" },
  { id: "grades", label: "Grades & Testing", icon: "\u{1F4DD}" },
  { id: "social", label: "Social Media & Loneliness", icon: "\u{1F4AC}" },
  { id: "influencer", label: "Influencer Culture", icon: "\u2728" },
];

// ── Content ────────────────────────────────────

export const CONTENT: ContentItem[] = [
  // phones
  { id: 1, topic: "phones", stance: "A", stanceLabel: "Restrict", headline: "One district\u2019s phone ban cut classroom disruptions in half", blurb: "Teachers say students are talking to each other at lunch again instead of scrolling." },
  { id: 2, topic: "phones", stance: "A", stanceLabel: "Restrict", headline: "Test scores rose the term after the ban began", blurb: "Administrators point to fewer mid-class interruptions as the likely driver." },
  { id: 3, topic: "phones", stance: "B", stanceLabel: "Against bans", headline: "A blanket ban shuts out students who rely on translation apps", blurb: "Some students use their phones for accessibility needs a ban doesn\u2019t account for." },
  { id: 4, topic: "phones", stance: "B", stanceLabel: "Against bans", headline: "Bans just push phone use into bathrooms, some schools found", blurb: "Without a policy that teaches use, enforcement turns into hide and seek." },

  // ai
  { id: 5, topic: "ai", stance: "A", stanceLabel: "Embrace", headline: "Students using AI tutors caught up two grade levels faster in a pilot", blurb: "Personalized pacing helped students who\u2019d fallen behind close the gap." },
  { id: 6, topic: "ai", stance: "A", stanceLabel: "Embrace", headline: "Teachers say AI drafting tools free up class time for real discussion", blurb: "Less time on first drafts means more time on argument and structure." },
  { id: 7, topic: "ai", stance: "B", stanceLabel: "Caution", headline: "Students who lean on AI answers retain less a week later", blurb: "A small study found recall dropped sharply without the struggle of a first attempt." },
  { id: 8, topic: "ai", stance: "B", stanceLabel: "Caution", headline: "Teachers report a rise in submissions that read identically", blurb: "Some are rethinking assignments entirely rather than trying to detect AI use." },

  // fashion
  { id: 9, topic: "fashion", stance: "A", stanceLabel: "Access", headline: "$8 trends make style accessible to teens who couldn\u2019t afford it before", blurb: "Fast fashion lowered the price of keeping up, for better or worse." },
  { id: 10, topic: "fashion", stance: "A", stanceLabel: "Access", headline: "Fast fashion lets small creators test bold looks with little financial risk", blurb: "Low-cost pieces make experimentation cheap instead of high-stakes." },
  { id: 11, topic: "fashion", stance: "B", stanceLabel: "Cost", headline: "A single garment can shed thousands of microplastic fibers per wash", blurb: "Synthetic blends dominate the fastest, cheapest product lines." },
  { id: 12, topic: "fashion", stance: "B", stanceLabel: "Cost", headline: "Workers describe quota systems that leave no time for breaks", blurb: "Reporting from several supply chains points to the same pattern." },

  // gaming
  { id: 13, topic: "gaming", stance: "A", stanceLabel: "Benefits", headline: "Multiplayer games were how some teens stayed connected in isolation", blurb: "For some, a shared server was the closest thing to hanging out." },
  { id: 14, topic: "gaming", stance: "A", stanceLabel: "Benefits", headline: "Researchers link certain puzzle games to measurable stress reduction", blurb: "Short, focused sessions showed the biggest effect in the study." },
  { id: 15, topic: "gaming", stance: "B", stanceLabel: "Risks", headline: "Some teens describe feeling unable to stop even when they want to", blurb: "Self-reported loss of control was highest around live-service titles." },
  { id: 16, topic: "gaming", stance: "B", stanceLabel: "Risks", headline: "Loot-box mechanics share design patterns with known gambling triggers", blurb: "Several regulators are now reviewing how these systems are labeled." },

  // climate
  { id: 17, topic: "climate", stance: "A", stanceLabel: "Individual", headline: "A teen-led recycling program cut a school\u2019s landfill waste 40%", blurb: "The pilot started with three classrooms and spread campus-wide." },
  { id: 18, topic: "climate", stance: "A", stanceLabel: "Individual", headline: "Small local composting projects are scaling into city-wide programs", blurb: "Several began as single-neighborhood volunteer efforts." },
  { id: 19, topic: "climate", stance: "B", stanceLabel: "Systemic", headline: "Just 100 companies are linked to most industrial emissions", blurb: "Analysts argue this reframes where responsibility should sit." },
  { id: 20, topic: "climate", stance: "B", stanceLabel: "Systemic", headline: "Individual-action messaging traces back to early fossil fuel PR", blurb: "Historians point to decades-old campaigns shaping today\u2019s framing." },

  // grades
  { id: 21, topic: "grades", stance: "A", stanceLabel: "Pro-grades", headline: "Clear grading gives students an early signal before problems compound", blurb: "Advocates say ambiguity helps no one when a student is already behind." },
  { id: 22, topic: "grades", stance: "A", stanceLabel: "Pro-grades", headline: "Standardized tests remain one of the few cross-school comparisons", blurb: "Without them, some colleges say they lose a shared reference point." },
  { id: 23, topic: "grades", stance: "B", stanceLabel: "Anti-grades", headline: "Schools that moved to narrative feedback saw anxiety scores drop", blurb: "Students reported less fear of a single number defining them." },
  { id: 24, topic: "grades", stance: "B", stanceLabel: "Anti-grades", headline: "Critics argue testing rewards test-taking skill over understanding", blurb: "Coaching-heavy prep can inflate scores without deeper learning." },

  // social
  { id: 25, topic: "social", stance: "A", stanceLabel: "Connective", headline: "Teens with niche interests say online communities are where they found real friends", blurb: "Shared, specific interests can matter more than geography." },
  { id: 26, topic: "social", stance: "A", stanceLabel: "Connective", headline: "Video calls let long-distance friendships stay genuinely close", blurb: "Regular calls kept several friend groups intact after a move." },
  { id: 27, topic: "social", stance: "B", stanceLabel: "Isolating", headline: "Heavy passive scrolling is linked to lower mood the same evening", blurb: "Several studies found the effect strongest for scrolling without posting." },
  { id: 28, topic: "social", stance: "B", stanceLabel: "Isolating", headline: "Some teens report comparing their lives to filtered highlight reels daily", blurb: "The comparison, not the platform itself, tracked closest with mood dips." },

  // influencer
  { id: 29, topic: "influencer", stance: "A", stanceLabel: "Opportunity", headline: "Teen creators are building real small businesses with a laptop and a following", blurb: "Some now employ classmates to help manage orders and editing." },
  { id: 30, topic: "influencer", stance: "A", stanceLabel: "Opportunity", headline: "Some influencers use their reach to fund community projects directly", blurb: "A handful have redirected brand deal income into local fundraisers." },
  { id: 31, topic: "influencer", stance: "B", stanceLabel: "Concern", headline: "Undisclosed sponsorships are far more common than platform rules allow", blurb: "Spot checks keep finding the same disclosure gap across regions." },
  { id: 32, topic: "influencer", stance: "B", stanceLabel: "Concern", headline: "Researchers link heavy influencer exposure to lower body-image scores", blurb: "The effect held even when the content wasn\u2019t about appearance directly." },
];
