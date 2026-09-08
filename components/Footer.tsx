import { HouseIcon } from "./icons";

export function Footer() {
  return (
    <footer className="border-t border-stone bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 text-sm text-ink/60 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <div className="flex items-center gap-2 text-ink">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-gold">
              <HouseIcon className="h-4 w-4" />
            </span>
            <span className="font-display text-base font-semibold">
              Jake Miller Realty
            </span>
          </div>
          <p className="mt-3">
            Brokered by Lone Star Residential, LLC. Equal Housing Opportunity.
            Texas Real Estate Commission Consumer Protection Notice and
            Information About Brokerage Services available on request.
          </p>
        </div>
        <div className="grid gap-1">
          <a href="#listings" className="hover:text-ink">
            Listings
          </a>
          <a href="#about" className="hover:text-ink">
            About Jake
          </a>
          <a href="#contact" className="hover:text-ink">
            Contact
          </a>
        </div>
      </div>
      <div className="border-t border-stone">
        <p className="mx-auto max-w-6xl px-5 py-4 text-xs text-ink/45">
          Demo site showcasing an AI lead-capture assistant. Jake Miller Realty
          is a fictional brokerage; listings, reviews and figures are
          illustrative.
        </p>
      </div>
    </footer>
  );
}
