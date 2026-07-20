import { describe, expect, it } from "vitest";
import { loginSchema } from "./validators";

describe("loginSchema", () => {
  it("accepts valid credentials", () => expect(loginSchema.safeParse({ email: "admin@example.com", password: "ChangeMe123!" }).success).toBe(true));
  it("rejects an invalid email", () => expect(loginSchema.safeParse({ email: "bad", password: "ChangeMe123!" }).success).toBe(false));
});
