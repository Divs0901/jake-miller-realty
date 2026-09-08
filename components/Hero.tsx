import Image from "next/image";
import { OpenChatButton } from "./OpenChatButton";

const HERO_IMG =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=2000&q=80&auto=format&fit=crop";

const stats = [
  { value: "320+", label: "Homes sold in Austin" },
  { value: "$184M", label: "Closed volume" },
  { value: "4.9★", label: "210 Google reviews" },
  { value: "<60s", label: "Average response time" },
];

export function Hero() {
  return (
    <>
      <section
        id="top"
        className="relative isolate flex min-h-[88vh] items-end overflow-hidden"
      >
        <Image
          src={HERO_IMG}
          alt="Modern Austin home lit up at dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/60 to-ink/20" />

        <div className="relative mx-auto w-full max-w-6xl px-5 pt-40 pb-20 text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Jake is online · replies in under 60 seconds
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.05] font-semibold sm:text-6xl lg:text-7xl">
            Find Your Dream Home in Austin, TX
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80">
            From Barton Hills to Mueller, Jake has helped more than 320 families
            buy and sell across Austin. Tell us what you&apos;re looking for and
            hear back within the hour.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <OpenChatButton className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink shadow-lg transition hover:bg-gold-bright">
              Chat with Jake now
            </OpenChatButton>
            <a
              href="#listings"
              className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20"
            >
              Browse listings
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-stone bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-3xl font-semibold">{s.value}</div>
              <div className="mt-1 text-sm text-ink/60">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
