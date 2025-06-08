const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function listInternships() {
  const r = await fetch(`${BASE}/api/internships`, { credentials: "include" });
  if (!r.ok) throw new Error("Fetch internships failed: " + r.status);
  return r.json();
}

export async function createInternship(data) {
  const r = await fetch(`${BASE}/api/internships`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("Create internship failed: " + r.status);
  return r.json();
}

export async function deleteInternship(id) {
  const r = await fetch(`${BASE}/api/internships/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!r.ok) throw new Error("Delete internship failed: " + r.status);
}

