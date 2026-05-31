"use client";
import { useState, useEffect } from "react";
import StatusBadge from "@/components/StatusBadge";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  _count: { bookings: number };
  createdAt: string;
  bookings: any[];
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      const res = await fetch("/api/admin/stats");
      // Since we don't have a dedicated customers API, get users from bookings
      const bookingsRes = await fetch("/api/bookings?status=all");
      const bookingsData = await bookingsRes.json();

      if (bookingsData?.bookings) {
        // Extract unique customers from bookings
        const customerMap = new Map<string, Customer>();
        for (const booking of bookingsData.bookings) {
          if (booking.user && booking.user.role !== "ADMIN") {
            if (!customerMap.has(booking.user.id)) {
              customerMap.set(booking.user.id, {
                id: booking.user.id,
                name: booking.user.name,
                email: booking.user.email,
                phone: booking.user.phone || null,
                _count: { bookings: 0 },
                createdAt: booking.createdAt,
                bookings: [],
              });
            }
            const c = customerMap.get(booking.user.id)!;
            c._count.bookings++;
            c.bookings.push(booking);
          }
        }
        setCustomers(Array.from(customerMap.values()));
      }
    } catch {} finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F5B21A] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B1F44]">Data Pelanggan</h1>
        <p className="text-sm text-gray-500 mt-1">
          {customers.length} pelanggan terdaftar
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="px-6 py-3 font-medium">Nama</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Telepon</th>
                <th className="px-6 py-3 font-medium">Total Pesanan</th>
                <th className="px-6 py-3 font-medium">Bergabung</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-t border-gray-50 hover:bg-gray-50/50 cursor-pointer"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-[#0B1F44] rounded-full flex items-center justify-center">
                        <span className="text-[#F5B21A] text-xs font-bold">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-[#0B1F44]">
                        {customer.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {customer.phone || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-[#0B1F44]/5 rounded-lg font-medium text-[#0B1F44]">
                      {customer._count.bookings} pesanan
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(customer.createdAt).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Belum ada pelanggan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-50">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="p-4 hover:bg-gray-50/50 cursor-pointer active:bg-gray-100"
              onClick={() => setSelectedCustomer(customer)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#0B1F44] rounded-full flex items-center justify-center shrink-0">
                  <span className="text-[#F5B21A] text-sm font-bold">
                    {customer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#0B1F44] text-sm truncate">
                    {customer.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {customer.email}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-[#0B1F44]/5 rounded-lg font-medium text-[#0B1F44] text-xs">
                    {customer._count.bookings}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-0.5">pesanan</p>
                </div>
              </div>
              {customer.phone && (
                <p className="text-xs text-gray-400 mt-1.5 ml-[52px]">
                  📞 {customer.phone}
                </p>
              )}
            </div>
          ))}
          {customers.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              Belum ada pelanggan
            </div>
          )}
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedCustomer(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#0B1F44] rounded-full flex items-center justify-center">
                  <span className="text-[#F5B21A] text-lg font-bold">
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="font-bold text-[#0B1F44]">
                    {selectedCustomer.name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedCustomer.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <h3 className="font-semibold text-[#0B1F44] mb-3">
              Riwayat Pesanan ({selectedCustomer._count.bookings})
            </h3>
            <div className="space-y-3">
              {selectedCustomer.bookings.map((booking: any) => (
                <div
                  key={booking.id}
                  className="bg-gray-50 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-[#0B1F44] text-sm">
                      {booking.car?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.startDate).toLocaleDateString("id-ID")}{" "}
                      - {new Date(booking.endDate).toLocaleDateString("id-ID")}
                    </p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      {booking.bookingCode}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={booking.status} />
                    <p className="text-sm font-medium text-[#0B1F44] mt-1">
                      Rp {booking.totalPrice?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
