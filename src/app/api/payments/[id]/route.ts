import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// PUT /api/payments/[id] - Verify or reject payment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    if (!body.status || !["VERIFIED", "REJECTED"].includes(body.status)) {
      return NextResponse.json(
        { error: "Status harus VERIFIED atau REJECTED" },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { booking: true },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Pembayaran tidak ditemukan" },
        { status: 404 }
      );
    }

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        status: body.status,
        verifiedAt: body.status === "VERIFIED" ? new Date() : null,
      },
    });

    // Update booking status based on payment verification
    if (body.status === "VERIFIED") {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: "CONFIRMED" },
      });

      // Mark car as RENTED
      await prisma.car.update({
        where: { id: payment.booking.carId },
        data: { status: "RENTED" },
      });
    } else if (body.status === "REJECTED") {
      // If payment rejected, set booking back to WAITING_PAYMENT so customer can re-upload
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: "WAITING_PAYMENT" },
      });
    }

    return NextResponse.json({ payment: updatedPayment });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Update payment error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
