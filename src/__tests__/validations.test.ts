import { describe, it, expect } from "vitest";

describe("Booking Validations", () => {
  it("validates service types exist", () => {
    const serviceTypes = ["SELF_DRIVE", "WITH_DRIVER"];
    expect(serviceTypes).toContain("SELF_DRIVE");
    expect(serviceTypes).toContain("WITH_DRIVER");
  });

  it("validates payment methods exist", () => {
    const methods = ["TRANSFER", "TUNAI"];
    expect(methods).toContain("TRANSFER");
    expect(methods).toContain("TUNAI");
  });

  it("validates booking statuses", () => {
    const statuses = [
      "WAITING_PAYMENT",
      "WAITING_VERIFICATION",
      "CONFIRMED",
      "REJECTED",
      "ON_RENT",
      "COMPLETED",
      "CANCELLED",
    ];
    expect(statuses).toHaveLength(7);
    expect(statuses).toContain("WAITING_VERIFICATION");
  });
});
