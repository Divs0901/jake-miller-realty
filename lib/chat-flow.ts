/**
 * The whole conversation lives here. Edit copy or options in one place and the
 * widget picks them up. Keep bot lines short: they render as chat bubbles.
 */

export const INTENT_OPTIONS = ["Buy", "Sell", "Just browsing"] as const;
export type Intent = (typeof INTENT_OPTIONS)[number];

export const BUDGET_OPTIONS = ["$200k–400k", "$400k–700k", "$700k+"] as const;
export type Budget = (typeof BUDGET_OPTIONS)[number];

export const script = {
  /** Short line for the nudge bubble; the full greeting runs in the panel. */
  nudge: "Hi! I'm Jake's assistant. Looking to buy or sell in Austin?",

  greeting:
    "Hi! I'm Jake's assistant. Jake's usually out at showings, so I take first questions. Looking to buy or sell in Austin?",

  listingContext: (address: string) =>
    `Great pick. ${address} is one of Jake's favorites this week.`,

  budgetPrompt: (intent: Intent) =>
    intent === "Sell"
      ? "Great! Roughly what do you expect your home to sell for?"
      : "Great! What's your budget range?",

  contactPrompt:
    "Perfect. Can I grab your name and number so Jake can reach out within the hour?",

  done: (name: string) =>
    `Got it, ${name} — Jake's with a client right now, but he'll call you within the hour. While you wait, three things worth thinking about:`,

  /**
   * Shown right after `done`. Keep these practical and about the visitor's
   * own situation. Never characterize neighborhoods (safety, schools, who
   * lives there) — that's steering under the Fair Housing Act.
   */
  tips: (intent: Intent) => {
    switch (intent) {
      case "Buy":
        return [
          "1. Are you pre-approved? It's the first thing a seller asks.",
          "2. Your three non-negotiables — area, bedrooms, commute.",
          "3. Your timeline. Jake plans very differently for 30 days versus six months.",
        ].join("\n");
      case "Sell":
        return [
          "1. When do you actually need to be out?",
          "2. Anything you'd fix before listing — Jake can tell you what's worth it.",
          "3. What similar homes nearby sold for. Jake will bring the numbers.",
        ].join("\n");
      default:
        return [
          "1. Which neighborhoods you keep coming back to.",
          "2. Whether you'd want to be pre-approved before you find the one.",
          "3. A rough timeline — even \"sometime next year\" helps Jake send the right listings.",
        ].join("\n");
    }
  },

  notified: (name: string) => `Jake has been notified about ${name}'s request.`,

  notifyFailed:
    "Your details are saved, but the instant alert didn't go through. Jake will still follow up today.",
} as const;

/** Header copy for the widget. */
export const widgetCopy = {
  title: "Jake Miller Realty",
  status: "Jake's assistant · replies instantly",
  launcherLabel: "Chat with Jake",
} as const;
