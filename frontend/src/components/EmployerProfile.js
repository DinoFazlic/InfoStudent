"use client";

import React, { useEffect, useState } from "react";
import styles from '@/styles/Profile.module.css';
import { FiUser, FiLogOut } from "react-icons/fi";

function Stars(props) {
  const fullStars = Math.round(props.rating);
  const starsArray = [];

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsArray.push("★");
    } else {
      starsArray.push("☆");
    }
  }

  return <span className={styles.stars}>{starsArray.join("")}</span>;
}

function ReviewCard(props) {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <span className={styles.reviewName}>{props.name}</span>
        <span className={styles.reviewRating}>{props.rating}/5</span>
      </div>
      <textarea className={styles.reviewText} value={props.comment} disabled rows={2} />
    </div>
  );
}

function EmployerProfile() {
  const [profile, setProfile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [activeSection, setActiveSection] = useState("profile");

  const reviewsReceived = [
    { name: "Ajla Mustafić", comment: "Lijepa saradnja.", rating: 5 },
    { name: "Tarik Kovačević", comment: "Brza komunikacija.", rating: 4 },
    { name: "Lejla Smajić", comment: "Top poslodavac!", rating: 5 }
  ];

  useEffect(function () {
    fetch("http://localhost:8000/users/employer_profile")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        setProfile(data);
        setForm(data);
      });
  }, []);

  function handleEditPhoto() {
    alert("Change photo (upload coming soon!)");
  }

  function handleSaveChanges() {
    setProfile(form);
    setEditMode(false);
    alert("Saved changes locally (backend coming soon!)");
  }

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    setForm(function (prevForm) {
      const updatedForm = {};
      for (const key in prevForm) {
        updatedForm[key] = prevForm[key];
      }
      updatedForm[name] = value;
      return updatedForm;
    });
  }

  function getInitials(first, last) {
    const firstLetter = first && first.length > 0 ? first[0] : "";
    const lastLetter = last && last.length > 0 ? last[0] : "";
    return (firstLetter + lastLetter).toUpperCase();
  }

  function handleLogout() {
    alert("Logging out...");
  }

  const averageScore = (
    reviewsReceived.reduce(function (total, review) {
      return total + review.rating;
    }, 0) / reviewsReceived.length
  ).toFixed(1);

  function renderSection() {
    if (activeSection === "profile") {
      return (
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Edit Company Profile</h2>
          <div className={styles.profileFormWrapper}>
            <div className={styles.formGroup}>
              <label>Company Name:</label>
              <input
                name="company_name"
                value={form.company_name || ""}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Company Description:</label>
              <textarea
                name="company_description"
                value={form.company_description || ""}
                onChange={handleChange}
                disabled={!editMode}
                rows={3}
              />
            </div>
            <div className={styles.formGroup}>
              <label>City:</label>
              <input
                name="city"
                value={form.city || ""}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Address:</label>
              <input
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Website URL:</label>
              <input
                name="website_url"
                value={form.website_url || ""}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Contact Number:</label>
              <input
                name="contact_phone"
                value={form.contact_phone || ""}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email:</label>
              <input
                name="email"
                value={form.email || ""}
                disabled
              />
            </div>
            <div className={styles.buttonGroup}>
              <button
                onClick={editMode ? handleSaveChanges : function () { setEditMode(true); }}
                className={editMode ? styles.saveButton : styles.editButton}
              >
                {editMode ? "Save Changes" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeSection === "reviews") {
      return (
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Company Reviews</h2>
          <div className={styles.averageScoreDisplay}>
            {averageScore}/5 <Stars rating={averageScore} />
          </div>
          <div className={styles.reviewsList}>
            {reviewsReceived.map(function (review, index) {
              return (
                <ReviewCard
                  key={index}
                  name={review.name}
                  comment={review.comment}
                  rating={review.rating}
                />
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  }

  if (!profile) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mobileHeader}>
        <button
          className={styles.menuToggleIcon}
          onClick={function () { setSidebarOpen(!sidebarOpen); }}
        >
          {sidebarOpen
            ? <img src="/favicons/left_arrow_icon.png" alt="Close" width={20} height={20} style={{ marginLeft: "400px" }} />
            : <img src="/favicons/right_arrow_icon.png" alt="Open" width={24} height={24} />
          }
        </button>
      </div>

      <div className={styles.sidebar + (sidebarOpen ? " " + styles.open : "")}>
        <div className={styles.profilePhotoWrapperSidebar}>
          {profile.profile_photo_url
            ? <img src={profile.profile_photo_url} alt="Profile" className={styles.profilePhoto} />
            : <div className={styles.photoPlaceholder}>
                {getInitials(profile.first_name, profile.last_name) || <FiUser size={48} />}
              </div>}
          <button onClick={handleEditPhoto} className={styles.editPhotoButton}>✏️</button>
          <div className={styles.profileName}>{profile.first_name} {profile.last_name}</div>
          <div className={styles.averageScore}>{averageScore}/5 <Stars rating={averageScore} /></div>
        </div>

        <button
          onClick={function () { setActiveSection("profile"); setSidebarOpen(false); setEditMode(false); }}
          className={styles.sidebarBtn}
        >
          Company Info
        </button>
        <button
          onClick={function () { setActiveSection("reviews"); setSidebarOpen(false); setEditMode(false); }}
          className={styles.sidebarBtn}
        >
          Reviews
        </button>
        <button onClick={handleLogout} className={styles.sidebarBtnLogout}>
          <FiLogOut /> Logout
        </button>
      </div>

      <div className={styles.mainContent}>
        {renderSection()}
      </div>
    </div>
  );
}

export default EmployerProfile;
