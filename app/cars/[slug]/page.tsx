import { prisma } from "@/lib/prisma";
import {
  Calendar,
  Gauge,
  Zap,
  Fuel,
  MessageCircle,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Badge from "@/components/ui/Badge";

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const car = await prisma.car.findUnique({
    where: { slug },
    include: { images: true },
  });

  if (!car) notFound();

  const waLink = `https://wa.me/6281234567890?text=Halo, saya tertarik dengan unit ${car.title}. Apakah masih tersedia?`;

  const specs = [
    { icon: Calendar, label: "Tahun",        value: String(car.year) },
    { icon: Gauge,    label: "Kilometer",     value: `${car.mileage.toLocaleString("id-ID")} km` },
    { icon: Zap,      label: "Transmisi",     value: car.transmission },
    { icon: Fuel,     label: "Bahan Bakar",   value: car.fuelType },
  ];

  const highlights = [
    "Mesin sehat & servis rutin",
    "Surat lengkap & pajak hidup",
    "Interior bersih, non-smoker",
    "Kaki-kaki senyap",
  ];

  const mainImg = car.images[0]?.url ?? null;

  return (
    <div className="min-h-screen bg-[#F5F3F3] pb-24 lg:pb-0">

      {/* Breadcrumb bar */}
      <div className="bg-white border-b border-zinc-200/70 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/cars"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors duration-150"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Katalog
          </Link>
          <Badge variant={car.isSold ? "error" : "blue"}>
            {car.isSold ? "Sudah terjual" : "Tersedia"}
          </Badge>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left / main column ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Main image */}
          <div className="relative w-full aspect-[16/9] rounded-[20px] overflow-hidden bg-gradient-to-br from-[#dde6ff] to-[#eef1ff] border border-zinc-200/70">
            {mainImg ? (
              <Image
                src={mainImg}
                alt={car.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="120" height="68" viewBox="0 0 120 68" fill="none" aria-hidden="true">
                  <path d="M8 45C8 39 12 34 17 33L28 20C32 16 37 14 43 14H77C83 14 88 16 92 20L103 33C108 34 112 39 112 45V56C112 58.8 109.8 61 107 61H13C10.2 61 8 58.8 8 56V45Z" fill="rgba(25,68,241,0.1)" stroke="rgba(25,68,241,0.22)" strokeWidth="1.5"/>
                  <circle cx="32" cy="60" r="10" fill="rgba(25,68,241,0.12)" stroke="rgba(25,68,241,0.3)" strokeWidth="1.5"/>
                  <circle cx="32" cy="60" r="4" fill="rgba(25,68,241,0.4)"/>
                  <circle cx="88" cy="60" r="10" fill="rgba(25,68,241,0.12)" stroke="rgba(25,68,241,0.3)" strokeWidth="1.5"/>
                  <circle cx="88" cy="60" r="4" fill="rgba(25,68,241,0.4)"/>
                </svg>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {car.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-0.5">
              {car.images.map((img, i) => (
                <div
                  key={img.id}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-[12px] overflow-hidden border transition-colors duration-150 ${
                    i === 0
                      ? "border-[#1944F1]/40"
                      : "border-zinc-200"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`${car.title} foto ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Title block */}
          <div className="bg-white rounded-[20px] border border-zinc-200/70 px-6 py-5">
            <p className="text-[12px] text-zinc-400 mb-1">
              {car.brand} · {car.year}
            </p>
            <h1 className="text-[24px] font-semibold text-zinc-900 tracking-[-0.5px] mb-3">
              {car.title}
            </h1>
            <p className="text-[22px] font-semibold text-[#1944F1] tracking-[-0.4px]">
              Rp {car.price.toLocaleString("id-ID")}
            </p>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {specs.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-[14px] border border-zinc-200/70 px-4 py-3.5"
              >
                <s.icon className="w-4 h-4 text-[#1944F1] mb-2" />
                <p className="text-[10px] font-semibold text-zinc-400 tracking-[0.05em] uppercase mb-0.5">
                  {s.label}
                </p>
                <p className="text-[13px] font-medium text-zinc-900">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Highlights + Description */}
          <div className="bg-white rounded-[20px] border border-zinc-200/70 px-6 py-5 space-y-5">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-0.5 h-4 bg-[#1944F1] rounded-full" />
                <h2 className="text-[14px] font-semibold text-zinc-900 tracking-[-0.2px]">
                  Kenapa mobil ini?
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {highlights.map((hl) => (
                  <div key={hl} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1944F1] flex-shrink-0" />
                    <span className="text-[13px] text-zinc-600">{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {car.description && (
              <div className="pt-4 border-t border-zinc-100">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-0.5 h-4 bg-[#1944F1] rounded-full" />
                  <h2 className="text-[14px] font-semibold text-zinc-900 tracking-[-0.2px]">
                    Deskripsi
                  </h2>
                </div>
                <p className="text-[13px] text-zinc-500 leading-relaxed whitespace-pre-line">
                  {car.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right / sticky contact card ── */}
        <div className="hidden lg:block">
          <div className="sticky top-[4.5rem] bg-white rounded-[20px] border border-zinc-200/70 p-6 space-y-5">
            {/* Price */}
            <div>
              <p className="text-[11px] font-medium text-zinc-400 mb-1">
                Harga nett / nego
              </p>
              <p className="text-[26px] font-semibold text-[#1944F1] tracking-[-0.5px]">
                Rp {car.price.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="h-px bg-zinc-100" />

            {/* Specs summary */}
            <div className="space-y-2">
              {specs.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-[12px] text-zinc-400">{s.label}</span>
                  <span className="text-[12px] font-medium text-zinc-700">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-zinc-100" />

            {/* CTA */}
            <div className="space-y-2">
              {car.isSold ? (
                <div className="w-full py-3 bg-[#F5F3F3] text-zinc-400 text-[13px] font-medium rounded-full text-center">
                  Unit ini sudah terjual
                </div>
              ) : (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#1944F1] text-white text-[13px] font-medium rounded-full hover:bg-[#1033d4] transition-colors duration-150"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat WhatsApp
                </a>
              )}
              <p className="text-[11px] text-center text-zinc-400">
                Terhubung langsung dengan owner
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-zinc-200/70 px-5 py-3.5 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-[0.05em]">
            Harga
          </p>
          <p className="text-[18px] font-semibold text-[#1944F1] tracking-[-0.4px]">
            Rp {(car.price / 1_000_000).toFixed(0)} jt
          </p>
        </div>
        {car.isSold ? (
          <span className="px-5 py-2.5 bg-[#F5F3F3] text-zinc-400 text-[13px] font-medium rounded-full">
            Sudah terjual
          </span>
        ) : (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1944F1] text-white text-[13px] font-medium rounded-full hover:bg-[#1033d4] transition-colors duration-150"
          >
            <MessageCircle className="w-4 h-4" />
            Chat WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}