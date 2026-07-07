import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET /api/settings
export async function GET() {
  try {
    const settings = await prisma.rentalSetting.findFirst();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// PUT /api/settings
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    // Check if settings exist
    const existing = await prisma.rentalSetting.findFirst();

    if (existing) {
      const settings = await prisma.rentalSetting.update({
        where: { id: existing.id },
        data: {
          rentalName: body.rentalName,
          address: body.address,
          openingHours: body.openingHours,
          phone1: body.phone1,
          phone2: body.phone2 || "",
          instagram: body.instagram || "",
          facebook: body.facebook || "",
          logoUrl: body.logoUrl || existing.logoUrl,
          bankName: body.bankName || existing.bankName,
          bankAccountNumber: body.bankAccountNumber || existing.bankAccountNumber,
          bankAccountName: body.bankAccountName || existing.bankAccountName,
        },
      });
      return NextResponse.json({ settings });
    } else {
      const settings = await prisma.rentalSetting.create({
        data: {
          rentalName: body.rentalName,
          address: body.address,
          openingHours: body.openingHours,
          phone1: body.phone1,
          phone2: body.phone2 || "",
          instagram: body.instagram || "",
          facebook: body.facebook || "",
          logoUrl: body.logoUrl || null,
          bankName: body.bankName || null,
          bankAccountNumber: body.bankAccountNumber || null,
          bankAccountName: body.bankAccountName || null,
        },
      });
      return NextResponse.json({ settings }, { status: 201 });
    }
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
