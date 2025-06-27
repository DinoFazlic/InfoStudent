const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


// GET /api/jobs
export async function listJobs(filters = {}) {
  const query = new URLSearchParams();

  if (filters.search) query.append("search", filters.search);
  if (filters.location) query.append("location", filters.location);
  if (filters.min_price) query.append("min_price", filters.min_price);

  const res = await fetch(`${BASE}/api/jobs?${query.toString()}`, {
    credentials: "include",
  });

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


