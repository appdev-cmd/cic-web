import { apiRequest } from "@/lib/api";
import type { LoginInput } from "@/lib/validators";

export type TokenPair = { access_token: string; refresh_token: string; role: "admin" | "manager" | "employee"; token_type: string; expires_in: number };

export const login = (payload: LoginInput) => apiRequest<TokenPair>("/auth/login", {
  method: "POST", body: JSON.stringify(payload)
});
