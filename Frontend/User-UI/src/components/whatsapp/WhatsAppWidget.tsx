"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircle, X } from "lucide-react";

type Props = {
  phone?: string;
  greeting?: string;
  prefill?: string;
};

export default function WhatsAppWidget(props: Props) {
  const [open, setOpen] = useState(false);
  const phone = props.phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "260966423719";
  const greeting = props.greeting || "Hello! How can I help you today?";
  const [message, setMessage] = useState(props.prefill || "");

  // Removed automatic URL prefill from the message to keep it clean.

  const link = useMemo(() => {
    const clean = String(phone).replace(/[^0-9]/g, "");
    const text = encodeURIComponent(message || greeting);
    return `https://wa.me/${clean}?text=${text}`;
  }, [phone, message, greeting]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="WhatsApp Chat"
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
      >
        <MessageCircle className="h-7 w-7" />
      </button>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between rounded-t-2xl bg-green-500 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                <MessageCircle className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold">WhatsApp Chat</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="rounded p-1 hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              {greeting}
            </div>
            <div className="mt-3">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </div>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
            >
              Start Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}
