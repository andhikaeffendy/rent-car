import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Upload file to Supabase Storage
 * @param bucket - Storage bucket name (e.g. "ktp", "payments", "cars")
 * @param file - File to upload
 * @param path - Optional path prefix
 * @returns Public URL of uploaded file
 */
export async function uploadFile(
  bucket: string,
  file: File,
  path?: string
): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  const prefix = path ? `${path}/` : "";
  const fileName = `${prefix}${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    throw new Error(`Gagal upload file: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(bucket: string, filePath: string) {
  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  const { error } = await supabase.storage.from(bucket).remove([filePath]);
  if (error) {
    console.error("Delete error:", error);
    throw new Error(`Gagal hapus file: ${error.message}`);
  }
}
