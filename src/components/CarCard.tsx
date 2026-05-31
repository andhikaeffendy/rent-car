import Link from "next/link";
import { Car } from "@/types";
import { formatPrice } from "@/lib/utils";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <Link href={`/cars/${car.slug}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-gray-100">
          <img
            src={car.imageUrl}
            alt={car.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Status badge */}
          <div className="absolute top-4 right-4">
            {car.status === "AVAILABLE" ? (
              <span className="px-2.5 py-1 bg-emerald-500/90 backdrop-blur-sm rounded-lg text-xs font-medium text-white">
                Tersedia
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-red-500/90 backdrop-blur-sm rounded-lg text-xs font-medium text-white">
                Tidak Tersedia
              </span>
            )}
          </div>

          {/* Transmission + Capacity */}
          <div className="absolute bottom-4 left-4 flex space-x-2">
            <span className="flex items-center space-x-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700">
              <svg className="w-3.5 h-3.5 text-[#F5B21A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{car.transmission}</span>
            </span>
            <span className="flex items-center space-x-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700">
              <svg className="w-3.5 h-3.5 text-[#F5B21A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{car.capacity} Kursi</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-[#0B1F44] text-lg mb-3 group-hover:text-[#F5B21A] transition-colors">
            {car.name}
          </h3>

          {/* Prices */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Lepas Kunci</span>
              <span className="font-bold text-[#F5B21A]">{formatPrice(car.priceSelfDrive)}</span>
            </div>
            {car.priceWithDriver && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Dengan Supir</span>
                <span className="font-bold text-[#0F5EF7]">{formatPrice(car.priceWithDriver)}</span>
              </div>
            )}
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <span className="text-xs text-gray-400">{car.fuelType} • {car.year}</span>
            <span className="inline-flex items-center text-sm font-medium text-[#F5B21A] group-hover:translate-x-1 transition-transform">
              Detail
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
