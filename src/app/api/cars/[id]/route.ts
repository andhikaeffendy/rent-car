import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const car = await prisma.car.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!car) {
      return NextResponse.json(
        { error: "Mobil tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ car });
  } catch (error) {
    console.error("Get car error:", error);
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

    const car = await prisma.car.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        transmission: body.transmission,
        capacity: parseInt(body.capacity),
        fuelType: body.fuelType,
        type: body.type,
        year: parseInt(body.year),
        color: body.color || null,
        priceSelfDrive: parseFloat(body.priceSelfDrive),
        priceWithDriver: body.priceWithDriver
          ? parseFloat(body.priceWithDriver)
          : null,
        imageUrl: body.imageUrl,
        galleryUrls: body.galleryUrls || [],
        description: body.description || null,
        facilities: body.facilities
          ? body.facilities
              .split(",")
              .map((f: string) => f.trim())
              .filter(Boolean)
          : [],
        status: body.status,
      },
    });

    return NextResponse.json({ car });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Update car error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.car.delete({ where: { id } });

    return NextResponse.json({ message: "Mobil berhasil dihapus" });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Delete car error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
