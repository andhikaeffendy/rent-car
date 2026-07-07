import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

// Helper to generate booking code
function generateBookingCode(): string {
  return `AGL-${uuidv4().substring(0, 8).toUpperCase()}`;
}

// Calculate duration in days
function calcDuration(startDate: Date, endDate: Date): number {
  const diff = endDate.getTime() - startDate.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let where: any = {};

    if (user.role === "ADMIN") {
      if (status) where.status = status;
    } else {
      where.userId = user.id;
      if (status) where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        car: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
        payments: true,
        documents: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await getCurrentUser();

    // Require login to create booking
    if (!user) {
      return NextResponse.json(
        { error: "Silakan login terlebih dahulu untuk melakukan pemesanan" },
        { status: 401 }
      );
    }

    const {
      carId,
      serviceType,
      pickupMethod,
      pickupAddress,
      deliveryPhone,
      paymentMethod,
      startDate,
      endDate,
      notes,
    } = body;

    // Validate required fields
    if (!carId || !serviceType || !pickupMethod || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Check car exists and is available
    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) {
      return NextResponse.json(
        { error: "Mobil tidak ditemukan" },
        { status: 404 }
      );
    }
    if (car.status !== "AVAILABLE") {
      return NextResponse.json(
        { error: "Mobil tidak tersedia untuk dipesan" },
        { status: 400 }
      );
    }

    // Calculate duration and pricing
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = calcDuration(start, end);

    const pricePerUnit =
      serviceType === "WITH_DRIVER" && car.priceWithDriver
        ? car.priceWithDriver
        : car.priceSelfDrive;
    const subtotal = pricePerUnit * duration;
    const deliveryFee = pickupMethod === "DELIVERY" ? 50000 : 0;
    const totalPrice = subtotal + deliveryFee;

    const booking = await prisma.booking.create({
      data: {
        bookingCode: generateBookingCode(),
        userId: user.id,
        carId,
        serviceType: serviceType as any,
        pickupMethod: pickupMethod as any,
        pickupAddress: pickupAddress || null,
        deliveryPhone: deliveryPhone || null,
        paymentMethod: paymentMethod || "TRANSFER",
        startDate: start,
        endDate: end,
        duration,
        subtotal,
        deliveryFee,
        totalPrice,
        notes: notes || null,
        status: paymentMethod === "TUNAI" ? "WAITING_VERIFICATION" : "WAITING_PAYMENT",
      },
      include: {
        car: true,
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
