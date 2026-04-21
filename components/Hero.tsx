import Link from "next/link";
import { ChevronRight } from "lucide-react";

const stats = [
  { value: "120+", label: "Unit tersedia" },
  { value: "4.9", label: "Rating pelanggan" },
  { value: "3 thn", label: "Berpengalaman" },
];

export default function Hero() {
  return (
    <section className="bg-[#F5F3F3] px-6 pt-14 pb-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-12">
        {/* Left — copy */}
        <div className="flex-1 min-w-0">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 bg-[#1944F1]/[0.08] text-[#1944F1] text-[11px] font-semibold tracking-[0.07em] uppercase px-3 py-1 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1944F1]" />
            Unit tersedia sekarang
          </div>

          {/* Title */}
          <h1 className="text-[36px] md:text-[44px] font-semibold text-slat-900 tracking-[-0.8px] leading-[1.12] mb-4">
            Mobil bekas
            <br />
            berkualitas,{" "}
            <em className="not-italic text-[#1944F1]">tanpa drama.</em>
          </h1>

          {/* Subtitle */}
          <p className="text-[15px] text-slat-500 leading-relaxed mb-8 max-w-md">
            Unit terkurasi, harga transparan, dan inspeksi menyeluruh. Temukan
            pilihanmu dan chat langsung ke owner.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/cars"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1944F1] text-white text-[13px] font-medium rounded-full hover:bg-[#1033d4] transition-colors duration-150"
            >
              Lihat Katalog
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="https://wa.me/6281234567890?text=Halo, saya ingin tanya-tanya unit yang tersedia."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-white text-slat-800 text-[13px] font-medium rounded-full border border-slat-200 hover:border-slat-300 hover:bg-slat-50 transition-colors duration-150"
            >
              Chat Sekarang
            </a>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-8 pt-7 border-t border-slat-200">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-[22px] font-semibold text-slat-900 tracking-[-0.5px]">
                  {s.value}
                </div>
                <div className="text-[11px] text-slat-400 mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — visual card */}
        <div className="w-full lg:w-[260px] flex-shrink-0">
          <div className="relative rounded-[20px] overflow-hidden border border-slat-200 aspect-[4/3] bg-gradient-to-br from-[#c8d8ff] to-[#e8eeff]">
            {/* Car illustration placeholder — replace with real <Image> */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                width="140"
                height="76"
                viewBox="0 0 140 76"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8 50C8 44 12 39 18 38L32 22C36 18 42 16 48 16H92C98 16 104 18 108 22L122 38C128 39 132 44 132 50V62C132 64.8 129.8 67 127 67H13C10.2 67 8 64.8 8 62V50Z"
                  fill="rgba(25,68,241,0.13)"
                  stroke="rgba(25,68,241,0.28)"
                  strokeWidth="1.5"
                />
                <circle
                  cx="38"
                  cy="66"
                  r="10"
                  fill="rgba(25,68,241,0.15)"
                  stroke="rgba(25,68,241,0.4)"
                  strokeWidth="1.5"
                />
                <circle cx="38" cy="66" r="4" fill="rgba(25,68,241,0.45)" />
                <circle
                  cx="102"
                  cy="66"
                  r="10"
                  fill="rgba(25,68,241,0.15)"
                  stroke="rgba(25,68,241,0.4)"
                  strokeWidth="1.5"
                />
                <circle cx="102" cy="66" r="4" fill="rgba(25,68,241,0.45)" />
                <rect
                  x="46"
                  y="22"
                  width="48"
                  height="14"
                  rx="3"
                  fill="rgba(25,68,241,0.08)"
                  stroke="rgba(25,68,241,0.2)"
                  strokeWidth="0.8"
                />
              </svg>
            </div>

            {/* Glass info tag — the ONE place glassmorphism is used here */}
            <div className="absolute bottom-3 left-3 right-3 bg-white/70 backdrop-blur-md border border-white/80 rounded-[10px] px-3 py-2 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-semibold text-slat-900 tracking-[-0.2px]">
                  Toyota Avanza
                </p>
                <p className="text-[10px] text-slat-400 mt-0.5">
                  2021 · 28.000 km
                </p>
              </div>
              <span className="text-[12px] font-semibold text-[#1944F1]">
                Rp 185 jt
              </span>
            </div>
          </div>

          {/* Trust pills */}
          <div className="flex gap-2 mt-2.5 flex-wrap">
            {[
              { icon: "★", text: "Terverifikasi" },
              { icon: "✓", text: "Inspeksi 72 poin" },
            ].map((p) => (
              <span
                key={p.text}
                className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slat-500 bg-white border border-slat-200 px-2.5 py-1 rounded-full"
              >
                <span className="text-[#1944F1]">{p.icon}</span>
                {p.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
