import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        car: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
        payments: true,
        documents: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Get booking error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const updateData: any = {};

    if (body.status) {
      updateData.status = body.status;

      // If confirming, also update car status to RENTED
      if (body.status === "CONFIRMED") {
        const booking = await prisma.booking.findUnique({
          where: { id },
          select: { carId: true },
        });
        if (booking) {
          await prisma.car.update({
            where: { id: booking.carId },
            data: { status: "RENTED" },
          });
        }
      }

      // If completing, mark car back to AVAILABLE
      if (body.status === "COMPLETED") {
        const booking = await prisma.booking.findUnique({
          where: { id },
          select: { carId: true },
        });
        if (booking) {
          await prisma.car.update({
            where: { id: booking.carId },
            data: { status: "AVAILABLE" },
          });
        }
      }
    }

    if (body.notes !== undefined) updateData.notes = body.notes;

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        car: true,
        payments: true,
        documents: true,
      },
    });

    return NextResponse.json({ booking });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Update booking error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
