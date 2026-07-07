import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// POST /api/upload
// Upload file ke local storage (public/uploads/)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 5MB" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Format file harus JPG, PNG, atau WebP" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, filename);

    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true });

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const url = `/uploads/${filename}`;

    return NextResponse.json({
      url,
      name: filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Gagal upload file" },
      { status: 500 }
    );
  }
}
