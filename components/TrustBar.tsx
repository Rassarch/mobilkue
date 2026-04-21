import {
  CheckCircle,
  ShieldCheck,
  FileText,
  BadgeDollarSign,
} from "lucide-react";

const trustItems = [
  { icon: CheckCircle, text: "100+ Unit Terjual" },
  { icon: ShieldCheck, text: "Inspeksi Mesin & Body" },
  { icon: FileText, text: "Dokumen Lengkap" },
  { icon: BadgeDollarSign, text: "Bisa Nego Langsung" },
];

export default function TrustBar() {
  return (
    <div className="bg-white border-y border-slat-200/70 py-5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustItems.map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2.5 justify-center md:justify-start"
            >
              <div className="w-7 h-7 rounded-[8px] bg-[#1944F1]/[0.07] flex items-center justify-center flex-shrink-0">
                <item.icon className="w-3.5 h-3.5 text-[#1944F1]" />
              </div>
              <span className="text-[13px] font-medium text-slat-600">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
