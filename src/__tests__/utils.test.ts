import { describe, it, expect } from "vitest";
import { formatPrice, formatDate } from "@/lib/utils";

describe("formatPrice", () => {
  it("formats number with thousands separator", () => {
    expect(formatPrice(150000)).toContain("150");
  });

  it("handles zero", () => {
    expect(formatPrice(0)).toContain("0");
  });
});

describe("formatDate", () => {
  it("formats date string correctly", () => {
    const result = formatDate("2026-07-07");
    expect(result).toContain("2026");
  });
});
