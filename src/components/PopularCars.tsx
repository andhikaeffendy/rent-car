"use client";
import { useState, useEffect } from "react";
import CarCard from "./CarCard";
import { Car } from "@/types";

export default function PopularCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cars?status=AVAILABLE")
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data.cars)) {
          // Show first 3 cars as "popular"
          setCars(data.cars.slice(0, 3));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="h-52 shimmer" />
            <div className="p-5 space-y-3">
              <div className="h-5 shimmer rounded w-3/4" />
              <div className="h-4 shimmer rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cars.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
