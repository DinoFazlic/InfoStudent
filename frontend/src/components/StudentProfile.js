"use client";

import React, { useEffect, useState } from "react";
import styles from '@/styles/Profile.module.css';

import StudentSidebar from "@/components/StudentProfileSections/StudentSidebar";
import StudentProfileSection from "@/components/StudentProfileSections/StudentProfileSection";
import StudentReviewsSection from "@/components/StudentProfileSections/StudentReviewsSection";
import StudentReviewsGivenSection from "@/components/StudentProfileSections/StudentReviewsGivenSection";

function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [reviewsReceived, setReviewsReceived] = useState([]);
  const [reviewsGiven, setReviewsGiven] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/auth/users/me", { credentials: "include" })
      .then(res => {
        if (res.status === 401) window.location.href = "/login";
        return res.json();
      })
      .then(data => {
        if (data.role !== "student") {
          window.location.href = "/login";
          return;
        }
        const studentData = { ...data, ...data.student_profile };
        setProfile(studentData);

        fetch("http://localhost:8000/reviews/received", { credentials: "include" })
          .then(res => res.json()).then(setReviewsReceived)
          .catch(err => console.error("Failed to fetch received reviews:", err));

        fetch("http://localhost:8000/reviews/given", { credentials: "include" })
          .then(res => res.json()).then(setReviewsGiven)
          .catch(err => console.error("Failed to fetch given reviews:", err));
      })
      .catch(err => console.error("Error:", err));
  }, []);

  const handleLogout = () => {
    fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(() => window.location.href = "/login")
      .catch(err => console.error("Logout failed:", err));
  };

  const handleEditPhoto = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("http://localhost:8000/users/student/profile/profile-photo", {
          method: "PUT",
          credentials: "include",
          body: formData,
        });
        const data = await res.json();
        if (res.ok) {
          setProfile(prev => ({ ...prev, profile_photo_url: data.photo_url }));
        } else {
          console.error("Failed to upload image:", data.detail);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    };
    input.click();
  };

  const handleUploadCV = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("http://localhost:8000/users/student/profile/cv", {
          method: "PUT",
          credentials: "include",
          body: formData,
        });
        const data = await res.json();
        if (res.ok) {
          setProfile(prev => ({ ...prev, cv_url: data.cv_url }));
        } else {
          console.error("Failed to upload CV:", data.detail);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    };
    input.click();
  };

  const handleUploadSchedule = async () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".pdf";

  fileInput.onchange = async () => {
    if (fileInput.files.length === 0) return;

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const res = await fetch("http://localhost:8000/users/student/upload-schedule", {
      method: "POST",
      body: formData,
      credentials: "include", // if you're using cookie-based auth
    });

    if (res.ok) {
      const data = await res.json();
      setProfile(prev => ({ ...prev, schedule_url: data.schedule_url }));
    } else {
      alert("Failed to upload schedule.");
    }
  };

  fileInput.click();
  };


  const handleSaveChanges = () => {
    const updatedData = {
      first_name: profile.first_name,
      last_name: profile.last_name,
      city: profile.city,
      contact_phone: profile.contact_phone,
      biography: profile.biography,
      skills: profile.skills,
      experience: profile.experience,
    };

    fetch("http://localhost:8000/users/student/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedData),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update");
        return res.json();
      })
      .then(() => setEditMode(false))
      .catch(err => console.error("Update failed:", err));
  };

  if (!profile) return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;

  const averageScore = reviewsReceived.length
    ? (reviewsReceived.reduce((total, r) => total + r.rating, 0) / reviewsReceived.length).toFixed(1)
    : "0.0";

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <StudentProfileSection
          profile={profile}
          setProfile={setProfile}
          editMode={editMode}
          setEditMode={setEditMode}
          handleUploadCV={handleUploadCV}
          handleSaveChanges={handleSaveChanges}
          handleUploadSchedule={handleUploadSchedule}
        />;
      case "myReviews":
        return <StudentReviewsSection reviewsReceived={reviewsReceived} averageScore={averageScore} />;
      case "reviewsHistory":
        return <StudentReviewsGivenSection reviewsGiven={reviewsGiven} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mobileHeader}>
        <button className={styles.menuToggleIcon} onClick={() => setSidebarOpen(!sidebarOpen)}>
          <img
            src={sidebarOpen ? "/favicons/left_arrow_icon.png" : "/favicons/right_arrow_icon.png"}
            alt={sidebarOpen ? "Close" : "Open"}
            width={24}
            height={24}
            style={{ transform: sidebarOpen ? "translateX(210px)" : "translateX(0px)", transition: "transform 0.3s ease" }}
          />
        </button>
      </div>

      <StudentSidebar
        profile={profile}
        averageScore={averageScore}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setActiveSection={setActiveSection}
        setEditMode={setEditMode}
        handleEditPhoto={handleEditPhoto}
        handleLogout={handleLogout}
      />

      <div className={styles.mainContent}>
        {renderSection()}
      </div>
    </div>
  );
}

export default StudentProfile;