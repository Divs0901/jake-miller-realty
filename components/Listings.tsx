import Image from "next/image";
import { formatPrice, listings, type Listing } from "@/lib/listings";
import { OpenChatButton } from "./OpenChatButton";
import { AreaIcon, BathIcon, BedIcon } from "./icons";

export function Listings() {
  return (
    <section id="listings" className="mx-auto max-w-6xl px-5 py-20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Featured listings</p>
          <h2 className="mt-2 font-display text-4xl font-semibold">
            Homes Jake is showing this week
          </h2>
        </div>
        <p className="max-w-sm text-sm text-ink/60">
          Want to see one in person? Ask in the chat and Jake will set up a
          showing within the hour.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </section>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={listing.image}
          alt={`${listing.address}, ${listing.city}`}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink shadow">
          {listing.tag}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-display text-2xl font-semibold">
            {formatPrice(listing.price)}
          </p>
          <p className="text-xs font-medium tracking-wide text-ink/50 uppercase">
            {listing.neighborhood}
          </p>
        </div>
        <p className="mt-1 text-sm text-ink/70">
          {listing.address}, {listing.city}
        </p>

        <ul className="mt-4 flex gap-4 text-sm text-ink/70">
          <li className="flex items-center gap-1.5">
            <BedIcon className="h-4 w-4" /> {listing.beds} bd
          </li>
          <li className="flex items-center gap-1.5">
            <BathIcon className="h-4 w-4" /> {listing.baths} ba
          </li>
          <li className="flex items-center gap-1.5">
            <AreaIcon className="h-4 w-4" />{" "}
            {listing.sqft.toLocaleString("en-US")} sqft
          </li>
        </ul>

        <p className="mt-3 text-sm text-ink/60">{listing.blurb}</p>

        <OpenChatButton
          context={listing.address}
          className="mt-5 w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm font-semibold transition hover:border-ink hover:bg-ink hover:text-white"
        >
          Ask about this home
        </OpenChatButton>
      </div>
    </article>
  );
}
