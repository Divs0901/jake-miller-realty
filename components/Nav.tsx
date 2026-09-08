import Link from "next/link";
import { OpenChatButton } from "./OpenChatButton";
import { HouseIcon, PhoneIcon } from "./icons";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone/70 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="#top" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-gold">
            <HouseIcon className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Jake Miller <span className="text-gold">Realty</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink/70 md:flex">
          <a href="#listings" className="transition hover:text-ink">
            Listings
          </a>
          <a href="#about" className="transition hover:text-ink">
            About Jake
          </a>
          <a href="#contact" className="transition hover:text-ink">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="tel:+15125550142"
            className="hidden items-center gap-2 text-sm font-medium text-ink/80 transition hover:text-ink sm:flex"
          >
            <PhoneIcon className="h-4 w-4" />
            (512) 555-0142
          </a>
          <OpenChatButton className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-ink-soft">
            Chat with Jake
          </OpenChatButton>
        </div>
      </div>
    </header>
  );
}
