const BASE =
  process.env.NEXT_PUBLIC_API_URL ??                 
  (typeof window === "undefined" ? "http://127.0.0.1:8000" : "");


export async function listInstructions(filters = {}) {
  const query = new URLSearchParams();

  if (filters.search) query.append("search", filters.search);
  if (filters.min_hourly_rate) query.append("min_hourly_rate", filters.min_hourly_rate);

  const res = await fetch(`${BASE}/api/instructions?${query.toString()}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Greška dohvaćanja: " + res.status);

  const data = await res.json();
  return data.map((i) => ({
    ...i,
    authorName: i.author_name ?? "Nepoznato",
    authorAvatarUrl: i.author_avatar_url ?? null,
    createdAt: i.created_at,
    author_email: i.author_email ?? null,
    author_phone: i.author_phone ?? null,
    author_schedule_url: i.author_schedule_url ?? null,
  }));
}



export async function createInstruction(payload) {
  const res = await fetch(`${BASE}/api/instructions`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Greška spremanja: " + res.status);

  const i = await res.json();
  return {
    ...i,
    authorName:        i.author_name,
    authorAvatarUrl:   i.author_avatar_url,
    createdAt:         i.created_at,
    author_email:      i.author_email ?? null,
    author_phone:      i.author_phone ?? null,
    author_schedule_url: i.author_schedule_url ?? null,
  };
}


export async function deleteInstruction(id) {
  const res = await fetch(`${BASE}/api/instructions/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete: " + res.status);
}


export async function updateInstruction(id, payload) {
  const res = await fetch(`${BASE}/api/instructions/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update: " + res.status);

  const i = await res.json();
  return {
    ...i,
    authorName: i.author_name,
    authorAvatarUrl: i.author_avatar_url,
    createdAt: i.created_at,
    author_email: i.author_email ?? null,
    author_phone: i.author_phone ?? null,
    author_schedule_url: i.author_schedule_url ?? null,
  };
}

