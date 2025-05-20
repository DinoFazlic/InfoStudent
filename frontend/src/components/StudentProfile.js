"use client";

import React, { useEffect, useState } from "react";
import styles from '@/styles/Profile.module.css';

import StudentSidebar from "@/components/StudentProfileSections/StudentSidebar";
import StudentProfileSection from "@/components/StudentProfileSections/StudentProfileSection";
import StudentReviewsSection from "@/components/StudentProfileSections/StudentReviewsSection";
import StudentReviewsGivenSection from "@/components/StudentProfileSections/StudentReviewsGivenSection";
import StudentInstructionPostsSection from "@/components/StudentProfileSections/StudentInstructionPostsSection";
import StudentAppliedPostsSection from "@/components/StudentProfileSections/StudentAppliedPostsSection";


function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [reviewsReceived, setReviewsReceived] = useState([]);
  const [reviewsGiven, setReviewsGiven] = useState([]);
  const [instructionPosts, setInstructionPosts] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [appliedInternships, setAppliedInternships] = useState([]);
  const [appliedInstructions, setAppliedInstructions] = useState([]);
  const [dataLoaded, setDataLoaded] = useState({
    profile: true,
    myReviews: false,
    reviewsHistory: false,
    instructionPosts: false,
    myApplications: false,
  });

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
      })
      .catch(err => console.error("Error:", err));
  }, []);

  useEffect(() => {
    if (activeSection === "myReviews" && !dataLoaded.myReviews) {
      fetch("http://localhost:8000/reviews/received", { credentials: "include" })
        .then(res => res.json())
        .then(data => {
          setReviewsReceived(data);
          setDataLoaded(prev => ({ ...prev, myReviews: true }));
        })
        .catch(err => console.error("Failed to fetch received reviews:", err));
    }

    if (activeSection === "reviewsHistory" && !dataLoaded.reviewsHistory) {
      fetch("http://localhost:8000/reviews/given", { credentials: "include" })
        .then(res => res.json())
        .then(data => {
          setReviewsGiven(data);
          setDataLoaded(prev => ({ ...prev, reviewsHistory: true }));
        })
        .catch(err => console.error("Failed to fetch given reviews:", err));
    }
  }, [activeSection, dataLoaded]);

  useEffect(() => {
    if (activeSection === "myInstructionPosts" && !dataLoaded.instructionPosts) {
      // MOCK: Replace with real API later
      const mockInstructions = [
        { id: 1, title: "Math Tutor", description: "Helping with calculus basics." },
        { id: 2, title: "Physics Help", description: "Newton's laws and energy." },
      ];
      setInstructionPosts(mockInstructions);
      setDataLoaded(prev => ({ ...prev, instructionPosts: true }));
    }

    if (activeSection === "myApplications" && !dataLoaded.myApplications) {
      // MOCK: Replace with real API later
      const mockJobs = [
        { id: 1, title: "Store Assistant", description: "Part-time help in local shop." },
      ];
      const mockInternships = [
        { id: 2, title: "Web Dev Intern", description: "Frontend work for NGO." },
      ];
      const mockInstructions = [
        { id: 3, title: "Chemistry Sessions", description: "Helping high school students." },
        { id: 4, title: "Chemistry Sessions", description: "Helping high school students." },
        { id: 5, title: "Chemistry Sessions", description: "Helping high school students." },
        { id: 36, title: "Chemistry Sessions", description: "Helping high school students." },
      ];

      setAppliedJobs(mockJobs);
      setAppliedInternships(mockInternships);
      setAppliedInstructions(mockInstructions);
      setDataLoaded(prev => ({ ...prev, myApplications: true }));
    }
  }, [activeSection, dataLoaded]);


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
          window.dispatchEvent(new CustomEvent("profilePhotoUpdated", {
            detail: { url: data.photo_url }
          }));
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
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = async () => {
      if (!input.files.length) return;

      const formData = new FormData();
      formData.append("file", input.files[0]);

      const res = await fetch("http://localhost:8000/users/student/upload-schedule", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(prev => ({ ...prev, schedule_url: data.schedule_url }));
      } else {
        alert("Failed to upload schedule.");
      }
    };
    input.click();
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

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
      case "myInstructionPosts":
        return <StudentInstructionPostsSection posts={instructionPosts} />;
      case "myApplications":
        return (
          <StudentAppliedPostsSection
            jobs={appliedJobs}
            internships={appliedInternships}
            instructions={appliedInstructions}
          />);
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
