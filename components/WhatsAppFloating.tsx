"use client";

import { MessageCircle } from "lucide-react";

const WA_URL =
  "https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang unit mobil yang ada di katalog.";

export default function WhatsAppFloating() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className="
        fixed bottom-6 right-6 z-50
        flex items-center gap-2
        bg-[#1944F1] text-white
        pl-4 pr-5 h-11
        rounded-full
        shadow-[0_4px_20px_rgba(25,68,241,0.30)]
        hover:bg-[#1033d4] hover:shadow-[0_4px_24px_rgba(25,68,241,0.40)]
        transition-all duration-200
        group
      "
    >
      <MessageCircle className="w-4 h-4 flex-shrink-0" />
      <span className="text-[13px] font-medium tracking-[-0.1px] whitespace-nowrap">
        Chat Owner
      </span>
    </a>
  );
}