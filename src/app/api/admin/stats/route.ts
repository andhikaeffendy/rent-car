import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const [
      totalCars,
      availableCars,
      totalBookings,
      waitingVerification,
      todayBookings,
      totalRevenue,
      allBookings,
    ] = await Promise.all([
      prisma.car.count(),
      prisma.car.count({ where: { status: "AVAILABLE" } }),
      prisma.booking.count(),
      prisma.booking.count({
        where: { status: "WAITING_VERIFICATION" },
      }),
      prisma.booking.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.payment.aggregate({
        where: { status: "VERIFIED" },
        _sum: { amount: true },
      }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          car: { select: { name: true, imageUrl: true } },
          user: { select: { name: true } },
        },
      }),
    ]);

    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await prisma.payment.groupBy({
      by: ["createdAt"],
      where: {
        status: "VERIFIED",
        createdAt: { gte: sixMonthsAgo },
      },
      _sum: { amount: true },
    });

    // Aggregate monthly revenue
    const revenueByMonth: Record<string, number> = {};
    monthlyRevenue.forEach((item) => {
      const month = item.createdAt.toISOString().substring(0, 7);
      revenueByMonth[month] =
        (revenueByMonth[month] || 0) + (item._sum.amount || 0);
    });

    return NextResponse.json({
      totalCars,
      availableCars,
      totalBookings,
      waitingVerification,
      todayBookings,
      totalRevenue: totalRevenue._sum.amount || 0,
      totalCustomers: await prisma.user.count({
        where: { role: "CUSTOMER" },
      }),
      recentBookings: allBookings,
      revenueByMonth,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
