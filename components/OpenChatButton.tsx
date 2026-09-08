"use client";

import type { ReactNode } from "react";

export const OPEN_CHAT_EVENT = "jmr:open-chat";

export type OpenChatDetail = { context?: string };

export function openChat(detail: OpenChatDetail = {}) {
  window.dispatchEvent(
    new CustomEvent<OpenChatDetail>(OPEN_CHAT_EVENT, { detail }),
  );
}

type Props = {
  children: ReactNode;
  className?: string;
  /** Optional listing address the bot should acknowledge when it opens. */
  context?: string;
};

/** Any button on the page that should pop the chat widget open. */
export function OpenChatButton({ children, className, context }: Props) {
  return (
    <button
      type="button"
      onClick={() => openChat({ context })}
      className={className}
    >
      {children}
    </button>
  );
}
