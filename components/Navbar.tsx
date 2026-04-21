"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Katalog" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 h-14 flex items-center border-b border-white/70 bg-white/60 backdrop-blur-xl backdrop-saturate-150">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-[30px] h-[30px] rounded-[8px] bg-[#1944F1] flex items-center justify-center flex-shrink-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 10.5C1 9.4 1.8 8.5 3 8.5h10c1.2 0 2 .9 2 2v1a1 1 0 01-1 1H2a1 1 0 01-1-1v-1z"
                fill="white"
              />
              <circle cx="4.5" cy="12" r="1.5" fill="#1944F1" />
              <circle cx="11.5" cy="12" r="1.5" fill="#1944F1" />
              <path
                d="M2.5 8.5L4 5h8l1.5 3.5"
                stroke="white"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-[-0.3px] text-slat-900">
            Mobil<span className="text-[#1944F1]">Ku</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[13px] font-medium px-3 py-1.5 rounded-[10px] transition-colors duration-150",
                pathname === link.href
                  ? "text-[#1944F1]"
                  : "text-slat-500 hover:text-slat-900 hover:bg-[#1944F1]/[0.06]",
              )}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/admin"
            className="text-[13px] font-medium px-3 py-1.5 rounded-[10px] text-slat-500 hover:text-slat-900 hover:bg-[#1944F1]/[0.06] transition-colors duration-150 ml-1"
          >
            Admin
          </Link>

          <a
            href="https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang unit yang tersedia."
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 text-[13px] font-medium text-white bg-[#1944F1] px-4 py-1.5 rounded-full hover:bg-[#1033d4] transition-colors duration-150"
          >
            Chat WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
}
