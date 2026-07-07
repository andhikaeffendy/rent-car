import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const capacity = searchParams.get("capacity");
    const transmission = searchParams.get("transmission");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const type = searchParams.get("type");

    const where: any = {};

    if (capacity) where.capacity = { gte: parseInt(capacity) };
    if (transmission) where.transmission = transmission;
    if (minPrice) {
      where.OR = [
        { priceSelfDrive: { gte: parseFloat(minPrice) } },
        { priceWithDriver: { gte: parseFloat(minPrice) } },
      ];
    }
    if (maxPrice) {
      const maxPriceVal = parseFloat(maxPrice);
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { priceSelfDrive: { lte: maxPriceVal } },
            { priceWithDriver: { lte: maxPriceVal } },
          ],
        },
      ];
    }
    if (status && status !== "all") where.status = status;
    else if (!status) where.status = "AVAILABLE";

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }
    if (type && (type === "MOBIL" || type === "MOTOR")) {
      where.type = type;
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { priceSelfDrive: "asc" };
    if (sort === "price_desc") orderBy = { priceSelfDrive: "desc" };

    const cars = await prisma.car.findMany({
      where,
      orderBy,
    });

    return NextResponse.json({ cars });
  } catch (error) {
    console.error("Get cars error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    const car = await prisma.car.create({
      data: {
        name: body.name,
        slug: body.slug,
        transmission: body.transmission || "AT",
        capacity: parseInt(body.capacity) || 4,
        fuelType: body.fuelType || "Bensin",
        type: body.type || "MOBIL",
        year: parseInt(body.year) || new Date().getFullYear(),
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
        status: body.status || "AVAILABLE",
      },
    });

    return NextResponse.json({ car }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Create car error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
