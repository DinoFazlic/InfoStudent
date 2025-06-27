const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function listInternships(filters = {}) {
  const query = new URLSearchParams();

  if (filters.search) query.append("search", filters.search);
  if (filters.location) query.append("location", filters.location);
  if (filters.min_stipend) query.append("min_stipend", filters.min_stipend);

  const res = await fetch(`${BASE}/api/internships?${query.toString()}`, {
    credentials: "include"
  });

  if (!res.ok) throw new Error("Fetch internships failed: " + res.status);
  return res.json();
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
  return r.json();
}

export const updateInternship = async (id, internshipData) => {
  const response = await fetch(`${BASE}/api/internships/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(internshipData),
  });
  if (!response.ok) {
    throw new Error("Failed to update internship");
  }
  return response.json();
};

export const saveInternship = async (internshipId) => {
  const response = await fetch(`${BASE}/api/internship-saves`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ internship_id: internshipId }),
  });
  if (!response.ok) {
    throw new Error("Failed to save internship");
  }
};

export const unsaveInternship = async (internshipId) => {
  const response = await fetch(`${BASE}/api/internship-saves/${internshipId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to unsave internship");
  }
};

