import { Car, MapPin, Phone, Globe, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slat-200/70 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand col */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-[30px] h-[30px] rounded-[8px] bg-[#1944F1] flex items-center justify-center flex-shrink-0">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="text-[15px] font-semibold tracking-[-0.3px] text-slat-900">
                Mobil<span className="text-[#1944F1]">Ku</span>
              </span>
            </div>
            <p className="text-[13px] text-slat-500 leading-relaxed max-w-xs mb-6">
              Solusi terpercaya untuk mobil bekas berkualitas. Semua unit
              melalui inspeksi ketat 72 titik sebelum masuk katalog.
            </p>
            <div className="flex gap-2">
              {[Globe, LinkIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-[8px] bg-[#F5F3F3] border border-slat-200 flex items-center justify-center text-slat-400 hover:text-[#1944F1] hover:border-[#1944F1]/20 transition-colors duration-150"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact col */}
          <div>
            <p className="text-[11px] font-semibold text-slat-400 tracking-[0.07em] uppercase mb-4">
              Kontak
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#1944F1] mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-slat-500 leading-snug">
                  Jl. Showroom Digital No. 123,
                  <br />
                  Jakarta Selatan
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-[#1944F1] flex-shrink-0" />
                <span className="text-[13px] text-slat-500">
                  +62 812 3456 7890
                </span>
              </li>
            </ul>
          </div>

          {/* Hours col */}
          <div>
            <p className="text-[11px] font-semibold text-slat-400 tracking-[0.07em] uppercase mb-4">
              Jam Operasional
            </p>
            <ul className="space-y-2">
              {[
                "Senin – Sabtu: 09.00 – 18.00",
                "Minggu: Dengan perjanjian",
              ].map((t) => (
                <li key={t} className="text-[13px] text-slat-500">
                  {t}
                </li>
              ))}
              <li className="pt-2">
                <span className="inline-block text-[11px] font-medium text-[#1944F1] bg-[#1944F1]/[0.08] px-2.5 py-1 rounded-full">
                  Chat online 24/7
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slat-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slat-400">
            &copy; {new Date().getFullYear()} UsedCars. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-[11px] text-slat-400 hover:text-slat-600 transition-colors duration-150"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
