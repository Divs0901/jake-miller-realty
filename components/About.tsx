import Image from "next/image";
import { CheckIcon, StarIcon } from "./icons";

const JAKE_IMG =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&q=80&auto=format&fit=crop";

const points = [
  "14 years selling Austin, born and raised in Travis Heights",
  "Average listing sells in 11 days, 3% above asking",
  "Every message answered personally, usually within the hour",
  "Trusted by 320+ families, from first homes to forever homes",
];

export function About() {
  return (
    <section id="about" className="bg-ink text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <div className="relative aspect-4/5 overflow-hidden rounded-3xl ring-1 ring-white/10">
          <Image
            src={JAKE_IMG}
            alt="Jake Miller, Austin REALTOR"
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-white/95 px-4 py-3 text-ink shadow-xl">
            <div>
              <p className="font-display text-lg font-semibold">Jake Miller</p>
              <p className="text-xs text-ink/60">REALTOR® · TREC #0741822</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold">
              <StarIcon className="h-4 w-4 text-gold" /> 4.9
            </div>
          </div>
        </div>

        <div>
          <p className="eyebrow">Meet Jake</p>
          <h2 className="mt-2 font-display text-4xl font-semibold">
            Austin born. Fourteen years selling it.
          </h2>
          <p className="mt-5 text-white/75">
            Buying or selling a home is the biggest deal most people ever make.
            Jake treats it that way: honest pricing, fast answers, and no
            pressure. If you message him, you hear back from him, not an
            assistant.
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-white/85">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold text-ink">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <blockquote className="mt-8 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
            <p className="text-white/90">
              &ldquo;We messaged Jake at 9pm on a Sunday expecting a reply
              Monday. He called back in two minutes and we had a showing booked
              for the next morning. Closed three weeks later.&rdquo;
            </p>
            <footer className="mt-3 text-sm text-white/60">
              Priya &amp; Marcus T. · bought in Mueller
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
