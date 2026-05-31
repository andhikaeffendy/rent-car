import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthToken, verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
