"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BUDGET_OPTIONS,
  INTENT_OPTIONS,
  script,
  widgetCopy,
  type Budget,
  type Intent,
} from "@/lib/chat-flow";
import { OPEN_CHAT_EVENT, type OpenChatDetail } from "./OpenChatButton";
import { ChatIcon, CheckIcon, CloseIcon, SendIcon } from "./icons";

type Role = "bot" | "user" | "system";
type Message = { id: number; role: Role; text: string };
type Step = "intent" | "budget" | "contact" | "sending" | "done";

const JAKE_AVATAR =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&h=160&fit=crop&crop=faces&q=80";

/** Delay before the proactive nudge bubble appears. */
const NUDGE_MS = 2500;
/** Set to a number of ms to auto-open the panel once per session; 0 disables. */
const AUTO_OPEN_MS = 0;
const AUTO_OPEN_KEY = "jmr-auto-opened";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState<Step>("intent");
  const [intent, setIntent] = useState<Intent | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [listing, setListing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const idRef = useRef(0);
  const openRef = useRef(false);
  const greetedRef = useRef(false);
  const pendingContextRef = useRef<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const push = useCallback((role: Role, text: string) => {
    idRef.current += 1;
    setMessages((m) => [...m, { id: idRef.current, role, text }]);
  }, []);

  const botSay = useCallback(
    async (text: string, delay = 900) => {
      setTyping(true);
      await sleep(delay);
      setTyping(false);
      push("bot", text);
    },
    [push],
  );

  // Greet once, the first time the panel opens.
  useEffect(() => {
    if (!open || greetedRef.current) return;
    greetedRef.current = true;
    (async () => {
      const ctx = pendingContextRef.current;
      if (ctx) {
        pendingContextRef.current = null;
        await botSay(script.listingContext(ctx), 600);
      }
      await botSay(script.greeting, 800);
    })();
  }, [open, botSay]);

  // Buttons elsewhere on the page open the widget through a window event.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<OpenChatDetail>).detail;
      if (detail?.context) {
        setListing(detail.context);
        if (greetedRef.current) {
          void botSay(script.listingContext(detail.context), 600);
        } else {
          pendingContextRef.current = detail.context;
        }
      }
      setNudge(false);
      setOpen(true);
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, [botSay]);

  // Proactive nudge and optional auto-open.
  useEffect(() => {
    const t1 = setTimeout(() => {
      if (!openRef.current) setNudge(true);
    }, NUDGE_MS);

    let t2: ReturnType<typeof setTimeout> | undefined;
    if (AUTO_OPEN_MS > 0) {
      let already = false;
      try {
        already = sessionStorage.getItem(AUTO_OPEN_KEY) === "1";
      } catch {}
      if (!already) {
        t2 = setTimeout(() => {
          if (openRef.current) return;
          setNudge(false);
          setOpen(true);
          try {
            sessionStorage.setItem(AUTO_OPEN_KEY, "1");
          } catch {}
        }, AUTO_OPEN_MS);
      }
    }
    return () => {
      clearTimeout(t1);
      if (t2) clearTimeout(t2);
    };
  }, []);

  // Keep the newest message in view.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing, step]);

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus the name field when we get to the contact step.
  useEffect(() => {
    if (step === "contact" && !typing) nameRef.current?.focus();
  }, [step, typing]);

  const handleIntent = async (opt: Intent) => {
    push("user", opt);
    setIntent(opt);
    setStep("budget");
    await botSay(script.budgetPrompt(opt));
  };

  const handleBudget = async (opt: Budget) => {
    push("user", opt);
    setBudget(opt);
    setStep("contact");
    await botSay(script.contactPrompt);
  };

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const digits = phone.replace(/\D/g, "");
    if (cleanName.length < 2) {
      setFormError("Please enter your name.");
      return;
    }
    if (digits.length < 10) {
      setFormError("Please enter a 10-digit phone number.");
      return;
    }
    setFormError(null);
    push("user", `${cleanName} · ${phone.trim()}`);
    setStep("sending");

    // Fire the notification immediately; the confirmation types out in parallel.
    const notify = fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent,
        budget,
        name: cleanName,
        phone: phone.trim(),
        listing,
        source: window.location.href,
      }),
    })
      .then((r) => r.ok)
      .catch(() => false);

    await botSay(script.done(cleanName), 1100);
    await botSay(script.tips(intent ?? "Just browsing"), 900);
    setStep("done");

    const ok = await notify;
    push("system", ok ? script.notified(cleanName) : script.notifyFailed);
  };

  const reset = () => {
    setMessages([]);
    setStep("intent");
    setIntent(null);
    setBudget(null);
    setListing(null);
    setName("");
    setPhone("");
    setFormError(null);
    greetedRef.current = false;
    // Re-run the greeting effect.
    setOpen(false);
    setTimeout(() => setOpen(true), 0);
  };

  const showChips = !typing && (step === "intent" || step === "budget");

  return (
    <>
      {/* Nudge bubble */}
      {nudge && !open && (
        <button
          type="button"
          onClick={() => {
            setNudge(false);
            setOpen(true);
          }}
          className="fixed right-6 bottom-24 z-50 flex max-w-[280px] items-start gap-3 rounded-2xl bg-white p-3 text-left text-sm shadow-xl ring-1 ring-black/5 animate-pop-in"
        >
          <Image
            src={JAKE_AVATAR}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
          <span>
            <span className="block text-xs font-semibold text-ink/60">
              Jake Miller
            </span>
            <span className="text-ink">{script.nudge}</span>
          </span>
          <span
            role="button"
            aria-label="Dismiss"
            onClick={(e) => {
              e.stopPropagation();
              setNudge(false);
            }}
            className="-mt-1 -mr-1 grid h-6 w-6 shrink-0 place-items-center rounded-full text-ink/40 hover:bg-ink/5 hover:text-ink"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </span>
        </button>
      )}

      {/* Launcher */}
      {!open && (
        <button
          type="button"
          onClick={() => {
            setNudge(false);
            setOpen(true);
          }}
          aria-label={widgetCopy.launcherLabel}
          className="fixed right-6 bottom-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-ink text-white shadow-xl ring-4 ring-gold/30 transition hover:scale-105"
        >
          {nudge && (
            <span className="absolute inset-0 rounded-full bg-gold/50 animate-pulse-ring" />
          )}
          <ChatIcon className="relative h-6 w-6" />
          {nudge && (
            <span className="absolute -top-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold ring-2 ring-white">
              1
            </span>
          )}
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Jake Miller Realty"
          className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white shadow-2xl ring-1 ring-black/5 animate-pop-in sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[620px] sm:max-h-[calc(100vh-3rem)] sm:w-[380px] sm:rounded-2xl"
        >
          <header className="flex items-center gap-3 bg-ink px-4 py-3.5 text-white">
            <span className="relative">
              <Image
                src={JAKE_AVATAR}
                alt="Jake Miller"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-gold"
              />
              <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-ink" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{widgetCopy.title}</p>
              <p className="truncate text-xs text-white/70">{widgetCopy.status}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="grid h-8 w-8 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </header>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto bg-cream px-4 py-4"
          >
            {messages.map((m) => (
              <Bubble key={m.id} message={m} />
            ))}
            {typing && <TypingDots />}
          </div>

          <div className="border-t border-stone bg-white p-3">
            {showChips && step === "intent" && (
              <Chips options={INTENT_OPTIONS} onPick={handleIntent} />
            )}
            {showChips && step === "budget" && (
              <Chips options={BUDGET_OPTIONS} onPick={handleBudget} />
            )}

            {step === "contact" && !typing && (
              <form onSubmit={handleContact} className="grid gap-2">
                <input
                  ref={nameRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  className="rounded-xl border border-stone bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                />
                <div className="flex gap-2">
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(512) 555-0100"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    className="min-w-0 flex-1 rounded-xl border border-stone bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                  />
                  <button
                    type="submit"
                    aria-label="Send"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink text-white transition hover:bg-ink-soft"
                  >
                    <SendIcon className="h-4 w-4" />
                  </button>
                </div>
                {formError && (
                  <p className="text-xs text-red-600">{formError}</p>
                )}
                <p className="text-[11px] text-ink/45">
                  By continuing you agree to receive a call or text from Jake.
                  No spam, ever.
                </p>
              </form>
            )}

            {(step === "sending" || typing) && step !== "contact" && (
              <p className="py-2 text-center text-xs text-ink/45">
                {step === "sending" ? "Sending to Jake…" : "Jake is typing…"}
              </p>
            )}

            {step === "done" && !typing && (
              <div className="flex items-center justify-between gap-3 py-1">
                <span className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                  <CheckIcon className="h-4 w-4" /> Request sent
                </span>
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs font-medium text-ink/60 underline-offset-2 hover:underline"
                >
                  Start over
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Bubble({ message }: { message: Message }) {
  if (message.role === "system") {
    return (
      <p className="flex items-center justify-center gap-1.5 px-6 text-center text-[11px] text-ink/50 animate-fade-up">
        <CheckIcon className="h-3 w-3" /> {message.text}
      </p>
    );
  }
  const isBot = message.role === "bot";
  return (
    <div
      className={`flex animate-fade-up ${isBot ? "justify-start" : "justify-end"}`}
    >
      <div
        className={
          isBot
            ? "max-w-[85%] whitespace-pre-line rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-sm text-ink shadow-sm ring-1 ring-stone"
            : "max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm text-white"
        }
      >
        {message.text}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex justify-start animate-fade-up">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-stone">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            style={{ animationDelay: `${d}ms` }}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40"
          />
        ))}
      </div>
    </div>
  );
}

function Chips<T extends string>({
  options,
  onPick,
}: {
  options: readonly T[];
  onPick: (opt: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 animate-fade-up">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onPick(o)}
          className="rounded-full border border-ink/20 px-4 py-2 text-sm font-medium text-ink transition hover:border-ink hover:bg-ink hover:text-white"
        >
          {o}
        </button>
      ))}
    </div>
  );
}
