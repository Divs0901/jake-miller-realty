# Jake Miller Realty — AI lead-capture demo

A one-page realtor site for a fictional Austin agent, with a chat widget that
qualifies visitors (buy/sell → budget → name & phone) and alerts the agent
instantly. Built to show realtors what a lead bot on their site looks like.

Everything is coded in Next.js: no Voiceflow, no Carrd, no third-party widget
script. One deploy on Vercel and it's live.

## Run it

```bash
npm install
npm run dev
# open http://localhost:3000
```

Without any env vars the flow works end-to-end and each lead is printed in the
terminal running `next dev` as a `[lead]` JSON line.

## Turn on the instant email

1. Create a free account at https://resend.com and make an API key.
2. `cp .env.example .env.local` and fill in:

   ```
   RESEND_API_KEY=re_...
   LEAD_TO_EMAIL=you@yourdomain.com
   ```

   `onboarding@resend.dev` (the default sender) only delivers to the address on
   your Resend account, which is all a demo needs. Verify a domain to send to a
   real client.
3. Restart `npm run dev`, complete the chat, check your inbox.

Optionally set `LEAD_WEBHOOK_URL` to a Zapier or Make catch-hook to also push
the lead into SMS, Google Sheets, or a CRM.

## Deploy

```bash
npx vercel
```

Add the same env vars in the Vercel project settings. That's it.

## Where things live

| What | File |
|------|------|
| Bot copy and options | `lib/chat-flow.ts` |
| Chat widget UI and state machine | `components/ChatWidget.tsx` |
| Lead notification (Resend + webhook) | `app/api/lead/route.ts` |
| The three listings | `lib/listings.ts` |
| Page sections | `components/Hero.tsx`, `Listings.tsx`, `About.tsx`, `Contact.tsx` |
| Colors and fonts | `app/globals.css` |

Any button can open the chat with `<OpenChatButton>`. Pass `context="1842 Barton
Hills Dr"` and the bot acknowledges the listing and includes it in the lead.

## Conversation flow

```
Bot:  Hey! Looking to buy or sell in Austin?
      [Buy] [Sell] [Just browsing]
Bot:  Great! What's your budget range?
      [$200k–400k] [$400k–700k] [$700k+]
Bot:  Perfect. Can I grab your name and number so Jake can reach out within the hour?
      (name) (phone) ➜
Bot:  Done! Jake typically responds in under 60 seconds. Check your phone.
      ✓ Jake has been notified.   ← POST /api/lead fired
```

The "Sell" branch swaps the budget question for "what do you expect your home
to sell for?" Edit wording in `lib/chat-flow.ts`.

## Loom script (about 75 seconds)

1. **0:00** Land on the hero. "This is a realtor's site. Watch the bottom
   right." Wait for the nudge bubble to appear (2.5s).
2. **0:10** Click it. Pick **Buy**, then **$400k–700k**.
3. **0:25** Type a name and your own phone number. Hit send.
4. **0:35** Bot says "Done! Jake typically responds in under 60 seconds."
5. **0:40** Switch to your inbox. The email is already there with call and text
   buttons. "That's the lead, qualified, in the agent's pocket before the
   visitor has scrolled down."
6. **0:55** Scroll to the disabled contact form. "We replaced this. Forms get
   ignored; chat converts."
7. **1:05** Click "Ask about this home" on a listing to show the bot picks up
   the property. Close.

Tip: set `AUTO_OPEN_MS` in `ChatWidget.tsx` to e.g. `6000` if you want the
panel to open by itself during the recording.

## If you'd rather use Voiceflow

Build the same four blocks in Voiceflow (Text → Buttons → Text → Buttons →
Text → Capture name → Capture phone → API step to `/api/lead` → Text), then
paste their embed `<script>` into `app/layout.tsx` and delete `<ChatWidget />`
from `app/page.tsx`. The API route accepts the same JSON either way:

```json
{ "intent": "Buy", "budget": "$400k–700k", "name": "Sam", "phone": "5125550100" }
```

## Note

Jake Miller Realty is fictional. Photos are from Unsplash; listings, reviews and
figures are illustrative. The footer says so.
