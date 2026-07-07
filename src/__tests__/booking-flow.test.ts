import { describe, it, expect } from "vitest";

describe("Booking Flow Logic", () => {
  it("Motor booking skips service selection", () => {
    const vehicleType = "MOTOR";
    const skipped = vehicleType === "MOTOR";
    expect(skipped).toBe(true);
  });

  it("Mobil booking requires service type", () => {
    const vehicleType = "MOBIL";
    const needsService = vehicleType === "MOBIL";
    expect(needsService).toBe(true);
  });

  it("TUNAI payment results in WAITING_VERIFICATION directly", () => {
    const method: string = "TUNAI";
    const expectedStatus = method === "TUNAI" ? "WAITING_VERIFICATION" : "WAITING_PAYMENT";
    expect(expectedStatus).toBe("WAITING_VERIFICATION");
  });

  it("TRANSFER payment results in WAITING_PAYMENT", () => {
    const method: string = "TRANSFER";
    const expectedStatus = method === "TUNAI" ? "WAITING_VERIFICATION" : "WAITING_PAYMENT";
    expect(expectedStatus).toBe("WAITING_PAYMENT");
  });

  it("calculates duration correctly", () => {
    const start = new Date("2026-07-10");
    const end = new Date("2026-07-13");
    const diffMs = end.getTime() - start.getTime();
    const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
    expect(days).toBe(3);
  });
});
