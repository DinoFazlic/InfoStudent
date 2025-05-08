import React, { useEffect, useState } from 'react';

function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetch('http://localhost:8000/users/student_profile')
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setForm(data);
      });
  }, []);

  if (!profile) return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (e) => {
    setForm(prev => ({
      ...prev,
      skills: e.target.value.split(",").map(s => s.trim())
    }));
  };

  const handleSave = () => {
    // This is where you'd send updated data to backend
    setProfile(form);
    setEditMode(false);
    alert("Profile saved (not really, backend not hooked up yet)!");
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "2rem auto",
      padding: "2rem",
      background: "#fff",
      borderRadius: "18px",
      boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)"
    }}>
      <h2 style={{ textAlign: "center", color: "#1976d2" }}>
        Student Profile
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <label>
          <span>First Name:</span>
          <input
            disabled={!editMode}
            name="first_name"
            value={form.first_name || ""}
            onChange={handleChange}
            style={{ width: "100%", padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </label>
        <label>
          <span>Last Name:</span>
          <input
            disabled={!editMode}
            name="last_name"
            value={form.last_name || ""}
            onChange={handleChange}
            style={{ width: "100%", padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </label>
        <label>
          <span>Email:</span>
          <input
            disabled
            name="email"
            value={form.email || ""}
            style={{ width: "100%", padding: "6px", borderRadius: "6px", border: "1px solid #eee", background: "#f8f8f8" }}
          />
        </label>
        <label>
          <span>Biography:</span>
          <textarea
            disabled={!editMode}
            name="biography"
            value={form.biography || ""}
            onChange={handleChange}
            rows={3}
            style={{ width: "100%", padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </label>
        <label>
          <span>Skills (comma separated):</span>
          <input
            disabled={!editMode}
            name="skills"
            value={form.skills ? form.skills.join(", ") : ""}
            onChange={handleArrayChange}
            style={{ width: "100%", padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </label>
        <label>
          <span>Experience:</span>
          <textarea
            disabled={!editMode}
            name="experience"
            value={form.experience || ""}
            onChange={handleChange}
            rows={2}
            style={{ width: "100%", padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </label>
      </div>
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            style={{
              padding: "10px 24px",
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Edit Profile
          </button>
        ) : (
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button
              onClick={handleSave}
              style={{
                padding: "10px 24px",
                background: "#43a047",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Save
            </button>
            <button
              onClick={() => {
                setForm(profile);
                setEditMode(false);
              }}
              style={{
                padding: "10px 24px",
                background: "#e53935",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentProfile;
