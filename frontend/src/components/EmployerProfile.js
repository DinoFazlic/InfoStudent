"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/Profile.module.css";

import EmployerSidebar from "@/components/EmployerProfileSections/EmployerSidebar";
import EmployerProfileSection from "@/components/EmployerProfileSections/EmployerProfileSection";
import EmployerReviewsSection from "@/components/EmployerProfileSections/EmployerReviewsSection";
import EmployerReviewsGivenSection from "@/components/EmployerProfileSections/EmployerReviewsGivenSection";
import EmployerPostsSection from "@/components/EmployerProfileSections/EmployerPostsSection";


function EmployerProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [reviewsReceived, setReviewsReceived] = useState([]);
  const [reviewsGiven, setReviewsGiven] = useState([]);
  const [employerPosts, setEmployerPosts] = useState({
  jobs: [],
  instructions: [],
  internships: [],
  });
  const [dataLoaded, setDataLoaded] = useState({
    profile: true,
    reviews: false,
    reviewsGiven: false,
    posts: false
  });

  useEffect(() => {
    fetch("http://localhost:8000/auth/users/me", {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) window.location.href = "/login";
        return res.json();
      })
      .then((data) => {
        if (data.role !== "employer") {
          window.location.href = "/login";
          return;
        }
        const employerData = { ...data, ...data.employer_profile };
        setProfile(employerData);
        setForm(employerData);
      });
  }, []);

  useEffect(() => {
    if (activeSection === "reviews" && !dataLoaded.reviews) {
      fetch("http://localhost:8000/reviews/received", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          setReviewsReceived(data);
          setDataLoaded((prev) => ({ ...prev, reviews: true }));
        })
        .catch(console.error);
    }

    if (activeSection === "reviewsGiven" && !dataLoaded.reviewsGiven) {
      fetch("http://localhost:8000/reviews/given", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          setReviewsGiven(data);
          setDataLoaded((prev) => ({ ...prev, reviewsGiven: true }));
        })
        .catch(console.error);
    }

    if (activeSection === "posts" && !dataLoaded.posts) {
    const simulateFetch = (label) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              title: `${label} Post 1`,
              description: `This is a ${label.toLowerCase()} opportunity.`,
            },
            {
              id: 2,
              title: `${label} Post 2`,
              description: `Another great ${label.toLowerCase()} post.`,
            },
          ]);
        }, 500);
      });

    Promise.all([
      simulateFetch("Job"),
      simulateFetch("Instruction"),
      simulateFetch("Internship"),
    ]).then(([jobs, instructions, internships]) => {
      setEmployerPosts({ jobs, instructions, internships });
      setDataLoaded((prev) => ({ ...prev, posts: true }));
    });
    }
  }, [activeSection, dataLoaded]);

  const handleLogout = () => {
    fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(() => window.location.href = "/login")
      .catch((err) => console.error("Logout failed:", err));
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
        const res = await fetch("http://localhost:8000/users/employer/profile/profile-photo", {
          method: "PUT",
          credentials: "include",
          body: formData,
        });

        const data = await res.json();
        if (res.ok) {
          setProfile((prev) => ({
            ...prev,
            profile_photo_url: data.photo_url,
          }));
          window.dispatchEvent(new CustomEvent("profilePhotoUpdated", {
            detail: { url: data.photo_url },
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

  const handleSaveChanges = () => {
    const updatedData = {
      first_name: form.first_name,
      last_name: form.last_name,
      company_name: form.company_name,
      company_description: form.company_description,
      address: form.address,
      website_url: form.website_url,
      contact_phone: form.contact_phone,
      city: form.city,
    };

    fetch("http://localhost:8000/users/employer/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update employer profile");
        return res.json();
      })
      .then(() => {
        setProfile(form);
        setEditMode(false);
      })
      .catch((err) => console.error("Update failed:", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const averageScore = reviewsReceived.length
    ? (reviewsReceived.reduce((total, r) => total + r.rating, 0) / reviewsReceived.length).toFixed(1)
    : "0.0";

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <EmployerProfileSection
            form={form}
            editMode={editMode}
            handleChange={handleChange}
            handleSaveChanges={handleSaveChanges}
            setEditMode={setEditMode}
          />
        );
      case "reviews":
        return <EmployerReviewsSection reviewsReceived={reviewsReceived} averageScore={averageScore} />;
      case "reviewsGiven":
        return <EmployerReviewsGivenSection reviewsGiven={reviewsGiven} />;
      case "posts":
        return <EmployerPostsSection posts={employerPosts} />;
      default:
        return null;
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }


  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mobileHeader}>
        <button
          className={styles.menuToggleIcon}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <img
            src={sidebarOpen ? "/favicons/left_arrow_icon.png" : "/favicons/right_arrow_icon.png"}
            alt={sidebarOpen ? "Close" : "Open"}
            width={24}
            height={24}
            style={{ transform: sidebarOpen ? "translateX(210px)" : "translateX(0px)", transition: "transform 0.3s ease" }}
          />
        </button>
      </div>

      <EmployerSidebar
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

export default EmployerProfile;
