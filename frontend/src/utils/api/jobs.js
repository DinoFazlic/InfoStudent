const BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window === "undefined" ? "http://127.0.0.1:8000" : "");


// GET /api/jobs
export async function listJobs() {
  const res = await fetch(`${BASE}/api/jobs`, { credentials:"include" });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

// POST /api/jobs
export async function createJob(payload){
  const res = await fetch(`${BASE}/api/jobs`,{
    method:"POST",
    credentials:"include",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify(payload)
  });
  if(!res.ok) throw new Error(res.statusText);
  return res.json();
}

// DELETE /api/jobs/:id
export async function deleteJob(id){
  const res = await fetch(`${BASE}/api/jobs/${id}`,{
    method:"DELETE",
    credentials:"include"
  });
  if(!res.ok) throw new Error(res.statusText);
}
