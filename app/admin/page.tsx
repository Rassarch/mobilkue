import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

import { Trash2, Edit, Plus, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { deleteCar, toggleSoldStatus } from "@/app/actions/cars";
import Badge from "@/components/ui/Badge";

export default async function AdminDashboard() {
  const cars = await prisma.car.findMany({
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  const totalUnit = cars.length;
  const totalAvail = cars.filter((c) => !c.isSold).length;
  const totalSold = cars.filter((c) => c.isSold).length;
  const totalValue = cars
    .filter((c) => !c.isSold)
    .reduce((sum, c) => sum + c.price, 0);

  const stats = [
    { label: "Total Unit", value: totalUnit },
    { label: "Tersedia", value: totalAvail },
    { label: "Terjual", value: totalSold },
    {
      label: "Nilai Tersedia",
      value: "Rp " + (totalValue / 1_000_000).toFixed(0) + " jt",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F3F3]">
      {/* Page header */}
      <div className="bg-white border-b border-slat-200/70 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slat-400 tracking-[0.07em] uppercase mb-0.5">
              Dashboard
            </p>
            <h1 className="text-[20px] font-semibold text-slat-900 tracking-[-0.4px]">
              Manajemen Katalog
            </h1>
          </div>
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1944F1] text-white text-[13px] font-medium rounded-full hover:bg-[#1033d4] transition-colors duration-150"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Unit
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-[14px] border border-slat-200/70 px-5 py-4"
            >
              <p className="text-[11px] text-slat-400 mb-1">{s.label}</p>
              <p className="text-[22px] font-semibold text-slat-900 tracking-[-0.5px]">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-[20px] border border-slat-200/70 overflow-hidden">
          {/* Table header */}
          <div className="px-5 py-4 border-b border-slat-100">
            <p className="text-[13px] font-medium text-slat-900 tracking-[-0.2px]">
              Semua unit
              <span className="ml-2 text-[11px] font-medium text-slat-400 bg-[#F5F3F3] px-2 py-0.5 rounded-full">
                {totalUnit}
              </span>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slat-100">
                  {["Unit", "Harga", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[11px] font-semibold text-slat-400 tracking-[0.04em] uppercase px-5 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slat-100">
                {cars.map((car) => (
                  <tr
                    key={car.id}
                    className="hover:bg-[#F5F3F3]/60 transition-colors duration-100"
                  >
                    {/* Unit */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {car.images[0]?.url ? (
                          <img
                            src={car.images[0].url}
                            alt={car.title}
                            className="w-10 h-10 rounded-[8px] object-cover flex-shrink-0 border border-slat-100"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-[8px] bg-[#F5F3F3] border border-slat-200 flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-[13px] font-medium text-slat-900 tracking-[-0.2px]">
                            {car.title}
                          </p>
                          <p className="text-[11px] text-slat-400 mt-0.5">
                            {car.brand} · {car.year}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Harga */}
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-medium text-[#1944F1] tracking-[-0.2px]">
                        Rp {(car.price / 1_000_000).toFixed(0)} jt
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <Badge variant={car.isSold ? "error" : "blue"}>
                        {car.isSold ? "Terjual" : "Tersedia"}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {/* Toggle sold */}
                        <form
                          action={toggleSoldStatus.bind(
                            null,
                            car.id,
                            car.isSold,
                          )}
                        >
                          <button
                            type="submit"
                            title={
                              car.isSold ? "Tandai tersedia" : "Tandai terjual"
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-[8px] text-slat-400 hover:bg-[#F5F3F3] hover:text-slat-700 transition-colors duration-150"
                          >
                            {car.isSold ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                          </button>
                        </form>

                        {/* Edit */}
                        <Link
                          href={`/admin/edit/${car.id}`}
                          className="w-8 h-8 flex items-center justify-center rounded-[8px] text-slat-400 hover:bg-[#F5F3F3] hover:text-slat-700 transition-colors duration-150"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {/* Delete */}
                        <form action={deleteCar.bind(null, car.id)}>
                          <button
                            type="submit"
                            className="w-8 h-8 flex items-center justify-center rounded-[8px] text-slat-400 hover:bg-red-50 hover:text-red-500 transition-colors duration-150"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {cars.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-[13px] text-slat-400">
                  Belum ada unit. Mulai tambahkan sekarang.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
