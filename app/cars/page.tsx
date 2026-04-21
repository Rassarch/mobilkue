import { prisma } from "@/lib/prisma";
import CarCard from "@/components/CarCard";

export default async function CarsPage() {
  const cars = await prisma.car.findMany({
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  const total = cars.length;
  const avail = cars.filter((c) => !c.isSold).length;

  return (
    <div className="min-h-screen bg-[#F5F3F3]">

      {/* Page header */}
      <div className="bg-white border-b border-zinc-200/70 px-5 sm:px-6 pt-8 pb-0">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-semibold text-zinc-400 tracking-[0.07em] uppercase mb-2">
            Katalog
          </p>
          <div className="flex items-end justify-between gap-4 pb-5">
            <h1 className="text-[24px] sm:text-[28px] font-semibold text-zinc-900 tracking-[-0.5px]">
              Semua unit
            </h1>
            <p className="text-[12px] text-zinc-400 mb-0.5 shrink-0">
              {avail} tersedia · {total} total
            </p>
          </div>

          {/* Filter chips — scroll horizontal di mobile */}
          <div className="flex gap-2 overflow-x-auto pb-4 -mx-5 sm:-mx-6 px-5 sm:px-6 scrollbar-none">
            {[
              { label: "Semua",     active: true },
              { label: "Tersedia",  active: false },
              { label: "Low KM",    active: false },
              { label: "Matic",     active: false },
              { label: "Terjual",   active: false },
            ].map((chip) => (
              <span
                key={chip.label}
                className={`
                  shrink-0 text-[11px] font-medium px-3.5 py-1.5 rounded-full border whitespace-nowrap cursor-pointer select-none
                  ${chip.active
                    ? "bg-[#1944F1] text-white border-transparent"
                    : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
                  }
                `}
              >
                {chip.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-5 sm:py-8 w-full">
        {cars.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-[13px] text-zinc-400">
              Belum ada unit yang tersedia saat ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}