/**
 * The whole conversation lives here. Edit copy or options in one place and the
 * widget picks them up. Keep bot lines short: they render as chat bubbles.
 */

export const INTENT_OPTIONS = ["Buy", "Sell", "Just browsing"] as const;
export type Intent = (typeof INTENT_OPTIONS)[number];

export const BUDGET_OPTIONS = ["$200k–400k", "$400k–700k", "$700k+"] as const;
export type Budget = (typeof BUDGET_OPTIONS)[number];

export const script = {
  greeting: "Hey! Looking to buy or sell in Austin?",

  listingContext: (address: string) =>
    `Great pick. ${address} is one of Jake's favorites this week.`,

  budgetPrompt: (intent: Intent) =>
    intent === "Sell"
      ? "Great! Roughly what do you expect your home to sell for?"
      : "Great! What's your budget range?",

  contactPrompt:
    "Perfect. Can I grab your name and number so Jake can reach out within the hour?",

  done: "Done! Jake typically responds in under 60 seconds. Check your phone.",

  notified: (name: string) => `Jake has been notified about ${name}'s request.`,

  notifyFailed:
    "Your details are saved, but the instant alert didn't go through. Jake will still follow up today.",
} as const;

/** Header copy for the widget. */
export const widgetCopy = {
  title: "Jake Miller Realty",
  status: "Online · replies in under 60s",
  launcherLabel: "Chat with Jake",
} as const;
