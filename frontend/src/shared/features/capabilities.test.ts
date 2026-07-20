import { describe, expect, it } from "vitest";
import { canAccess, type Capabilities } from "./capabilities";

const capabilities: Capabilities = {
  modules: { categories: true, leads: false },
  features: { category_management: true },
  permissions: ["category.view"],
};

describe("canAccess", () => {
  it("requires module, feature and permission together", () => {
    expect(canAccess(capabilities, { module: "categories", feature: "category_management", permission: "category.view" })).toBe(true);
    expect(canAccess(capabilities, { module: "leads" })).toBe(false);
    expect(canAccess(capabilities, { permission: "category.manage" })).toBe(false);
  });
});
