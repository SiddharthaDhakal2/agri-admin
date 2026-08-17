"use client";
import { useCallback, useEffect, useState } from "react";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4200/api";
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");
const tokenKey = "agribridgeAdminToken";
const userKey = "agribridgeAdminUser";
export function setAdminSession(data: { token: string; user: unknown }) { localStorage.setItem(tokenKey, data.token); localStorage.setItem(userKey, JSON.stringify(data.user)); }
export function getAdminUser() { try { return JSON.parse(localStorage.getItem(userKey) || "null"); } catch { return null; } }
export function clearAdminSession() { localStorage.removeItem(tokenKey); localStorage.removeItem(userKey); }
export function assetUrl(value?: string | null) { if (!value) return ""; if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) return value; if (value.startsWith("/category-")) return value; if (value.startsWith("/")) return `${API_ORIGIN}${value}`; return value; }
export async function adminApi<T>(path: string, options: RequestInit = {}): Promise<T> { const token = typeof window === "undefined" ? null : localStorage.getItem(tokenKey); const response = await fetch(`${API_URL}${path}`, { ...options, headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }, cache: "no-store" }); const payload = await response.json().catch(() => ({})); if (!response.ok) throw new Error(payload.message || "Request failed"); return payload.data as T; }
export function useAdminApi<T>(path: string, initial: T) { const [data, setData] = useState(initial); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const refresh = useCallback(async () => { setLoading(true); try { setData(await adminApi<T>(path)); setError(""); } catch (reason) { setError(reason instanceof Error ? reason.message : "Request failed"); } finally { setLoading(false); } }, [path]); useEffect(() => { void refresh(); }, [refresh]); return { data, setData, loading, error, refresh }; }
