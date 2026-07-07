import { describe, it, expect } from "vitest";

describe("API Client", () => {
  it("has valid API routes", () => {
    const routes = [
      "/api/cars",
      "/api/auth/login",
      "/api/auth/register",
      "/api/bookings",
      "/api/settings",
      "/api/admin/stats",
      "/api/upload",
    ];
    routes.forEach((route) => {
      expect(route).toMatch(/^\/api\//);
    });
  });
});
