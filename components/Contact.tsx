import { OpenChatButton } from "./OpenChatButton";

const field =
  "w-full rounded-xl border border-stone bg-cream px-4 py-3 text-sm outline-none";

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-20">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <p className="eyebrow">Get in touch</p>
          <h2 className="mt-2 font-display text-4xl font-semibold">
            Let&apos;s talk about your move
          </h2>
          <p className="mt-5 text-ink/70">
            Whether you&apos;re six months out or need to list this week, the
            first conversation is free and there&apos;s no obligation.
          </p>

          <dl className="mt-8 grid gap-5 text-sm">
            <div>
              <dt className="font-semibold">Office</dt>
              <dd className="text-ink/70">
                2210 S Lamar Blvd, Suite 140 · Austin, TX 78704
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Phone</dt>
              <dd className="text-ink/70">
                <a href="tel:+15125550142" className="hover:text-ink">
                  (512) 555-0142
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Hours</dt>
              <dd className="text-ink/70">
                Showings 7 days a week · chat answered 24/7
              </dd>
            </div>
          </dl>
        </div>

        {/* The form is intentionally disabled. The chat widget captures leads. */}
        <div className="relative">
          <form
            className="rounded-2xl bg-white p-6 ring-1 ring-stone"
            aria-hidden="true"
          >
            <fieldset disabled className="grid gap-4 opacity-40 select-none">
              <div className="grid gap-4 sm:grid-cols-2">
                <input className={field} placeholder="Full name" />
                <input className={field} placeholder="Phone" />
              </div>
              <input className={field} placeholder="Email" />
              <textarea
                className={`${field} min-h-32 resize-none`}
                placeholder="Tell us a little about what you're looking for"
              />
              <button className="rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white">
                Send message
              </button>
            </fieldset>
          </form>

          <div className="absolute inset-0 grid place-items-center p-6">
            <div className="max-w-xs rounded-2xl bg-ink p-6 text-center text-white shadow-2xl ring-1 ring-white/10 animate-fade-up">
              <p className="eyebrow">Faster than a form</p>
              <p className="mt-2 font-display text-2xl leading-snug">
                Skip the inbox. Chat gets you Jake in under 60 seconds.
              </p>
              <OpenChatButton className="mt-5 w-full rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink transition hover:bg-gold-bright">
                Start the chat
              </OpenChatButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
