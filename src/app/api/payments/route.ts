import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET /api/payments
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status) where.status = status;

    const payments = await prisma.payment.findMany({
      where,
      include: {
        booking: {
          include: {
            car: { select: { name: true } },
            user: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ payments });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Get payments error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// POST /api/payments - Create payment for a booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, amount, transferProofUrl } = body;

    if (!bookingId || !amount || !transferProofUrl) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount: parseFloat(amount),
        transferProofUrl,
        status: "WAITING",
      },
    });

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "WAITING_VERIFICATION" },
    });

    return NextResponse.json({ payment }, { status: 201 });
  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
