"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCar, updateCar } from "@/app/actions/cars";
import { Save, Loader2, ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

interface CarData {
  id: string;
  title?: string;
  brand?: string;
  year?: number;
  price?: number;
  mileage?: number;
  transmission?: string;
  fuelType?: string;
  isSold?: boolean;
  description?: string;
  images?: { url: string }[];
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold text-slat-400 tracking-[0.06em] uppercase mb-1.5">
      {children}
    </label>
  );
}

const inputBase =
  "w-full px-3.5 py-2.5 bg-[#F5F3F3] border border-slat-200 rounded-[10px] text-[13px] text-slat-900 placeholder-slat-400 focus:outline-none focus:border-[#1944F1]/40 focus:bg-white transition-colors duration-150";

const selectBase =
  "w-full px-3.5 py-2.5 bg-[#F5F3F3] border border-slat-200 rounded-[10px] text-[13px] text-slat-900 focus:outline-none focus:border-[#1944F1]/40 focus:bg-white transition-colors duration-150 appearance-none cursor-pointer";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-0.5 h-4 bg-[#1944F1] rounded-full" />
      <h2 className="text-[14px] font-semibold text-slat-900 tracking-[-0.2px]">
        {children}
      </h2>
    </div>
  );
}

export default function CarForm({ car }: { car?: CarData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(
    car?.images?.map((img) => img.url) ?? [""],
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const finalData = {
      ...data,
      imageUrls: imageUrls.filter((url) => url.trim() !== ""),
    };

    try {
      if (car) {
        await updateCar(car.id, finalData);
      } else {
        await createCar(finalData);
      }
      router.push("/admin");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  const addImageUrl = () => setImageUrls([...imageUrls, ""]);
  const updateImageUrl = (i: number, val: string) => {
    const next = [...imageUrls];
    next[i] = val;
    setImageUrls(next);
  };
  const removeImageUrl = (i: number) =>
    setImageUrls(imageUrls.filter((_, idx) => idx !== i));

  return (
    <div className="min-h-screen bg-[#F5F3F3]">
      {/* Top bar */}
      <div className="bg-white border-b border-slat-200/70 px-6 py-4 sticky top-14 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slat-500 hover:text-slat-900 transition-colors duration-150"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali
          </Link>

          <div>
            <p className="text-[11px] font-semibold text-slat-400 tracking-[0.07em] uppercase text-center mb-0.5">
              {car ? "Edit Unit" : "Tambah Unit"}
            </p>
          </div>

          <button
            type="submit"
            form="car-form"
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1944F1] text-white text-[13px] font-medium rounded-full hover:bg-[#1033d4] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {car ? "Simpan" : "Tambah Mobil"}
          </button>
        </div>
      </div>

      {/* Form body */}
      <form
        id="car-form"
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto px-6 py-8 space-y-6"
      >
        {/* Row 1: Informasi Dasar + Spesifikasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Informasi Dasar */}
          <div className="bg-white rounded-[20px] border border-slat-200/70 p-6">
            <SectionTitle>Informasi Dasar</SectionTitle>
            <div className="space-y-4">
              <div>
                <FieldLabel>Judul Iklan</FieldLabel>
                <input
                  name="title"
                  defaultValue={car?.title}
                  required
                  placeholder="Contoh: Toyota Avanza G 2021"
                  className={inputBase}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Brand</FieldLabel>
                  <input
                    name="brand"
                    defaultValue={car?.brand}
                    required
                    placeholder="Toyota"
                    className={inputBase}
                  />
                </div>
                <div>
                  <FieldLabel>Tahun</FieldLabel>
                  <input
                    name="year"
                    type="number"
                    defaultValue={car?.year}
                    required
                    placeholder="2021"
                    className={inputBase}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Harga (Rp)</FieldLabel>
                <input
                  name="price"
                  type="number"
                  defaultValue={car?.price}
                  required
                  placeholder="185000000"
                  className={inputBase}
                />
              </div>
            </div>
          </div>

          {/* Spesifikasi Teknis */}
          <div className="bg-white rounded-[20px] border border-slat-200/70 p-6">
            <SectionTitle>Spesifikasi Teknis</SectionTitle>
            <div className="space-y-4">
              <div>
                <FieldLabel>Kilometer (KM)</FieldLabel>
                <input
                  name="mileage"
                  type="number"
                  defaultValue={car?.mileage}
                  required
                  placeholder="28000"
                  className={inputBase}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Transmisi</FieldLabel>
                  <select
                    name="transmission"
                    defaultValue={car?.transmission ?? "Otomatis"}
                    className={selectBase}
                  >
                    <option value="Otomatis">Otomatis</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <FieldLabel>Bahan Bakar</FieldLabel>
                  <select
                    name="fuelType"
                    defaultValue={car?.fuelType ?? "Bensin"}
                    className={selectBase}
                  >
                    <option value="Bensin">Bensin</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
              </div>

              {car && (
                <div>
                  <FieldLabel>Status Unit</FieldLabel>
                  <select
                    name="isSold"
                    defaultValue={car.isSold ? "true" : "false"}
                    className={selectBase}
                  >
                    <option value="false">Tersedia</option>
                    <option value="true">Sudah Terjual</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="bg-white rounded-[20px] border border-slat-200/70 p-6">
          <SectionTitle>Deskripsi & Highlight</SectionTitle>
          <textarea
            name="description"
            defaultValue={car?.description}
            required
            rows={4}
            placeholder="Tuliskan keunggulan mobil ini: kondisi interior, riwayat servis, aksesoris tambahan..."
            className={`${inputBase} resize-none`}
          />
        </div>

        {/* Foto */}
        <div className="bg-white rounded-[20px] border border-slat-200/70 p-6">
          <div className="flex items-center justify-between mb-5">
            <SectionTitle>Foto Mobil</SectionTitle>
            <button
              type="button"
              onClick={addImageUrl}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#1944F1] hover:opacity-80 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah URL
            </button>
          </div>

          <div className="space-y-2.5">
            {imageUrls.map((url, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateImageUrl(i, e.target.value)}
                  required={i === 0}
                  placeholder="https://example.com/image.jpg"
                  className={`${inputBase} flex-1`}
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageUrl(i)}
                    className="w-9 h-9 flex items-center justify-center rounded-[10px] text-slat-400 hover:bg-red-50 hover:text-red-500 transition-colors duration-150 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <p className="mt-3 text-[11px] text-slat-400">
            Gunakan link yang berakhiran .jpg, .jpeg, atau .png
          </p>
        </div>
      </form>
    </div>
  );
}
