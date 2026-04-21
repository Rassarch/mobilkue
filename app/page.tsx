import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

import CarCard from "@/components/CarCard";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const cars = await prisma.car.findMany({
    take: 4,
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col bg-[#F5F3F3]">
      <Hero />
      <TrustBar />

      {/* Cars section */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full">
        {/* Section header */}
        <div className="flex justify-between items-end mb-7">
          <div>
            <p className="text-[11px] font-semibold text-slat-400 tracking-[0.07em] uppercase mb-1">
              Katalog
            </p>
            <h2 className="text-[20px] font-semibold text-slat-900 tracking-[-0.4px]">
              Unit terbaru
            </h2>
          </div>
          <Link
            href="/cars"
            className="flex items-center gap-1 text-[13px] font-medium text-[#1944F1] hover:opacity-80 transition-opacity"
          >
            Lihat semua
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {/* CTA block */}
        <div className="mt-16 bg-[#1944F1] rounded-[20px] px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 overflow-hidden relative">
          {/* Subtle decorative circles — bukan gradient blob, cukup opacity rendah */}
          <div className="absolute w-56 h-56 rounded-full bg-white/[0.04] -top-16 -right-10 pointer-events-none" />
          <div className="absolute w-32 h-32 rounded-full bg-white/[0.04] bottom-[-3rem] right-16 pointer-events-none" />

          <div className="relative">
            <h3 className="text-[17px] font-semibold text-white tracking-[-0.3px] mb-1.5">
              Nggak nemu yang cocok?
            </h3>
            <p className="text-[13px] text-white/60 leading-relaxed max-w-sm">
              Titip cari mobil impianmu, dan kami akan kabari begitu unit
              tersedia di katalog.
            </p>
          </div>

          <a
            href="https://wa.me/6281234567890?text=Halo, saya mencari mobil tertentu..."
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex-shrink-0 inline-flex items-center gap-2 px-6 py-2.5 bg-white text-[#1944F1] text-[13px] font-medium rounded-full hover:bg-slat-100 transition-colors duration-150"
          >
            Hubungi via WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
