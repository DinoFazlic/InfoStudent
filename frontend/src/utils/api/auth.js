const BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window === "undefined" ? "http://127.0.0.1:8000" : "");


/**
 * Poziv GET /auth/users/me
 *  – vraća { id, first_name, last_name, role, ... }
 *  – ili `null` ako nije prijavljen
 */
export async function getMe() {
  const res = await fetch(`${BASE}/auth/users/me`, {
    credentials: "include",
  });

  if (res.status === 401) return null;         // nije logiran
  if (!res.ok) throw new Error(res.statusText);

  return res.json();
}
