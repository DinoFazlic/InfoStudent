"use client";

import React, { useEffect, useState } from "react";
import styles from '@/styles/Profile.module.css';
import { FiUser, FiLogOut } from "react-icons/fi";

// Show stars from 0–5 based on rating number
function Stars(props) {
  var fullStars = Math.round(props.rating);
  var starsArray = [];

  for (var i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsArray.push("★");
    } else {
      starsArray.push("☆");
    }
  }

  return <span className={styles.stars}>{starsArray.join("")}</span>;
}

// Shows a single review block
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

// Main student profile page
function StudentProfile() {
  var [profile, setProfile] = useState(null);
  var [activeSection, setActiveSection] = useState("profile");
  var [sidebarOpen, setSidebarOpen] = useState(false);
  var [editMode, setEditMode] = useState(false);

  // Example review data
  var reviewsReceived = [
    { name: "Dino Fazlić", comment: "Super instruktor!", rating: 5 },
    { name: "Ajla Mustafić", comment: "Vrlo ljubazan.", rating: 4 },
    { name: "Tarik Kovačević", comment: "Preporuka!", rating: 4 },
    { name: "Lejla Smajić", comment: "Top!", rating: 5 },
    { name: "Edin Avdić", comment: "Ok.", rating: 3 }
  ];

  var myReviews = [
    { name: "PMF Student Jobs", comment: "Super firma.", rating: 5 },
    { name: "Jasmin S.", comment: "Pomogao mi.", rating: 4 },
    { name: "Nina Jukić", comment: "Odlična kolegica.", rating: 5 }
  ];

  // Fetch data from FastAPI backend
  useEffect(function () {
    fetch("http://localhost:8000/users/student_profile")
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        setProfile(data);
      })
      .catch(function (err) {
        console.log("Error fetching profile:", err);
      });
  }, []);

  // If not loaded yet
  if (!profile) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;
  }

  // Average rating
  var averageScore = (
    reviewsReceived.reduce(function (total, review) {
      return total + review.rating;
    }, 0) / reviewsReceived.length
  ).toFixed(1);

  // Click handlers
  function handleLogout() {
    alert("Logging out...");
  }

  function handleEditPhoto() {
    alert("Change profile photo (upload coming soon!)");
  }

  function handleSaveChanges() {
    alert("Saved changes locally (backend coming soon!)");
    setEditMode(false);
  }

  function renderSection() {
    if (activeSection === "profile") {
      return (
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Edit Profile</h2>
          <div className={styles.profileFormWrapper}>
            <div className={styles.formGroup}>
              <label>First Name:</label>
              <input value={profile.first_name ? profile.first_name : ""} disabled={!editMode} />
            </div>
            <div className={styles.formGroup}>
              <label>Last Name:</label>
              <input value={profile.last_name ? profile.last_name : ""} disabled={!editMode} />
            </div>
            <div className={styles.formGroup}>
              <label>Email:</label>
              <input value={profile.email ? profile.email : ""} disabled />
            </div>
            <div className={styles.formGroup}>
              <label>City:</label>
              <input value={profile.city ? profile.city : ""} disabled={!editMode} />
            </div>
            <div className={styles.formGroup}>
              <label>Biography:</label>
              <textarea value={profile.biography ? profile.biography : ""} disabled={!editMode} rows={3} />
            </div>
            <div className={styles.formGroup}>
              <label>Skills (comma separated):</label>
              <input value={profile.skills ? profile.skills.join(", ") : ""} disabled={!editMode} />
            </div>
            <div className={styles.formGroup}>
              <label>Experience:</label>
              <textarea value={profile.experience ? profile.experience : ""} disabled={!editMode} rows={2} />
            </div>
            <div className={styles.formGroup}>
              <label>CV / Resume (URL):</label>
              <input value={profile.cv_url ? profile.cv_url : ""} disabled={!editMode} />
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

    if (activeSection === "myReviews") {
      return (
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Your Rating</h2>
          <div className={styles.averageScoreDisplay}>
            {averageScore}/5 <Stars rating={averageScore} />
          </div>
          <div className={styles.reviewsList}>
            {reviewsReceived.map(function (review, index) {
              return <ReviewCard key={index} name={review.name} comment={review.comment} rating={review.rating} />;
            })}
          </div>
        </div>
      );
    }

    if (activeSection === "reviewsHistory") {
      return (
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>My Ratings History</h2>
          <div className={styles.reviewsList}>
            {myReviews.map(function (review, index) {
              return <ReviewCard key={index} name={review.name} comment={review.comment} rating={review.rating} />;
            })}
          </div>
        </div>
      );
    }

    return null;
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
          {profile.profile_photo_url && profile.profile_photo_url.length > 0
            ? <img src={profile.profile_photo_url} alt="Profile" className={styles.profilePhoto} />
            : <div className={styles.photoPlaceholder}><FiUser size={48} /></div>}
          <button onClick={handleEditPhoto} className={styles.editPhotoButton}>✏️</button>
          <div className={styles.profileName}>
            {profile.first_name} {profile.last_name}
          </div>
          <div className={styles.averageScore}>
            {averageScore}/5 <Stars rating={averageScore} />
          </div>
        </div>

        <button onClick={function () {
          setActiveSection("profile");
          setSidebarOpen(false);
          setEditMode(false);
        }} className={styles.sidebarBtn}>Profile Info</button>

        <button onClick={function () {
          setActiveSection("myReviews");
          setSidebarOpen(false);
          setEditMode(false);
        }} className={styles.sidebarBtn}>My Reviews</button>

        <button onClick={function () {
          setActiveSection("reviewsHistory");
          setSidebarOpen(false);
          setEditMode(false);
        }} className={styles.sidebarBtn}>Reviews History</button>

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

export default StudentProfile;
