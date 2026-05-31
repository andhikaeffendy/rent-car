import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// POST /api/bookings/[id]/documents - Upload KTP to booking
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const body = await request.json();

    if (!body.ktpUrl) {
      return NextResponse.json(
        { error: "URL KTP wajib diisi" },
        { status: 400 }
      );
    }

    // Verify booking exists and user has access
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan" },
        { status: 404 }
      );
    }

    if (user?.role !== "ADMIN" && booking.userId && booking.userId !== user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const document = await prisma.document.create({
      data: {
        bookingId: id,
        ktpUrl: body.ktpUrl,
      },
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error("Create document error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
