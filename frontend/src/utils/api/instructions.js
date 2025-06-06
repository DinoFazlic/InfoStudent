const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";


export async function listInstructions() {
  const res = await fetch(`${BASE}/api/instructions`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Greška dohvaćanja: " + res.status);
  return res.json();
}

export async function createInstruction(body) {
  const res = await fetch(`${BASE}/api/instructions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Greška spremanja");
  }
  return res.json();
}
