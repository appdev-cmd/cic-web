import { describe, expect, it } from "vitest";
import { demoLegalDocuments, demoProducts } from "./data";
import { classifyIntent, legalSearch, normalizePhone, searchProducts, stockLabel, validName } from "./mock-ai";

describe("demo business rules", () => {
  it("classifies and filters products by budget", () => {
    const intent = classifyIntent("Tôi cần máy khoan bê tông dưới 3 triệu");
    const products = searchProducts(demoProducts, intent);
    expect(intent.intent).toBe("product_consulting");
    expect(intent.maxPrice).toBe(3_000_000);
    expect(products.every(product => product.category === "Máy khoan" && product.price <= 3_000_000)).toBe(true);
  });

  it("applies stock labels", () => {
    expect(stockLabel(0)).toBe("Hết hàng");
    expect(stockLabel(4)).toBe("Sắp hết");
    expect(stockLabel(12)).toBe("Còn hàng");
  });

  it("normalizes Vietnamese phone numbers without AI", () => {
    expect(normalizePhone("0912.345.678")).toBe("+84912345678");
    expect(normalizePhone("+84 912 345 678")).toBe("+84912345678");
    expect(normalizePhone("12345")).toBeNull();
  });

  it("validates names and retrieves legal sources", () => {
    expect(validName("Nguyễn Văn An")).toBe(true);
    expect(validName("test")).toBe(false);
    expect(legalSearch(demoLegalDocuments, "Điều kiện cấp phép xây dựng là gì?").length).toBeGreaterThan(0);
  });
});
