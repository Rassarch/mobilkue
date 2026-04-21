import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";

interface CarImage {
  url: string;
}

interface Car {
  id: string;
  slug: string;
  title: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  isSold: boolean;
  images: CarImage[];
}

export default function CarCard({ car }: { car: Car }) {
  const waLink = `https://wa.me/6281234567890?text=Halo, saya tertarik dengan unit ${car.title}. Apakah masih tersedia?`;
  const imgSrc = car.images[0]?.url ?? null;
  const isLowKm = !car.isSold && car.mileage < 30_000;

  return (
    <div className="group bg-white rounded-[22px] overflow-hidden border border-zinc-100 hover:border-[#1944F1]/20 hover:shadow-[0_6px_28px_rgba(25,68,241,0.08)] transition-all duration-200">

      {/* ── Image area ── */}
      <div className="relative h-[190px] overflow-hidden">

        {/* Background — gambar atau placeholder gradient */}
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={car.title}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#dce6ff] via-[#eef1ff] to-[#f5f7ff] flex items-center justify-center">
            <svg width="130" height="72" viewBox="0 0 130 72" fill="none" aria-hidden="true">
              <path d="M8 46C8 41 11 37 16 36L27 23C31 19 36 17 42 17H88C94 17 99 19 103 23L114 36C119 37 122 41 122 46V59C122 61.8 119.8 64 117 64H13C10.2 64 8 61.8 8 59V46Z" fill="rgba(25,68,241,0.1)" stroke="rgba(25,68,241,0.2)" strokeWidth="1.2"/>
              <circle cx="31" cy="63" r="9" fill="rgba(25,68,241,0.11)" stroke="rgba(25,68,241,0.3)" strokeWidth="1.2"/>
              <circle cx="31" cy="63" r="4" fill="rgba(25,68,241,0.4)"/>
              <circle cx="99" cy="63" r="9" fill="rgba(25,68,241,0.11)" stroke="rgba(25,68,241,0.3)" strokeWidth="1.2"/>
              <circle cx="99" cy="63" r="4" fill="rgba(25,68,241,0.4)"/>
              <rect x="47" y="21" width="36" height="11" rx="2.5" fill="rgba(25,68,241,0.06)" stroke="rgba(25,68,241,0.15)" strokeWidth="0.7"/>
            </svg>
          </div>
        )}

        {/* Gradient overlay — beri kedalaman + buat teks terbaca */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

        {/* Judul + tahun di atas overlay — ini yang bikin berkarakter */}
        <div className="absolute bottom-3 left-4 right-14">
          <h3 className="text-[15px] font-semibold text-white leading-snug tracking-[-0.2px] drop-shadow-sm">
            {car.title}
          </h3>
          <p className="text-[11px] text-white/70 mt-0.5">{car.year}</p>
        </div>

        {/* Status badge — top left */}
        {car.isSold ? (
          <span className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-red-500/15 text-red-200 border border-red-400/25 backdrop-blur-sm">
            Terjual
          </span>
        ) : isLowKm ? (
          <span className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-400/25 backdrop-blur-sm">
            Low KM
          </span>
        ) : null}

        {/* Glass price tag — top right */}
        <div className="absolute top-3 right-3 bg-white/75 backdrop-blur-md border border-white/80 rounded-[9px] px-2.5 py-1.5">
          <span className="text-[12px] font-semibold text-[#1944F1] tracking-[-0.2px]">
            Rp {(car.price / 1_000_000).toFixed(0)} jt
          </span>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="px-4 py-3.5">

        {/* Spec pills */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {[
            `${car.mileage.toLocaleString("id-ID")} km`,
            car.transmission,
            car.fuelType,
          ].map((spec) => (
            <span
              key={spec}
              className="text-[11px] font-medium text-zinc-500 bg-[#F5F3F3] border border-zinc-200/80 px-2 py-1 rounded-[6px]"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Actions */}
        {car.isSold ? (
          <div className="w-full text-center text-[12px] font-medium text-zinc-400 bg-[#F5F3F3] py-2.5 rounded-[11px]">
            Unit sudah terjual
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_1.6fr] gap-2">
            <Link
              href={`/cars/${car.slug}`}
              className="text-center text-[12px] font-medium text-zinc-700 bg-[#F5F3F3] border border-zinc-200 py-2.5 rounded-[11px] hover:border-zinc-300 transition-colors duration-150"
            >
              Detail
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 text-[12px] font-medium text-white bg-[#1944F1] py-2.5 rounded-[11px] hover:bg-[#1033d4] transition-colors duration-150"
            >
              <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" />
              Chat Sekarang
            </a>
          </div>
        )}
      </div>
    </div>
  );
}