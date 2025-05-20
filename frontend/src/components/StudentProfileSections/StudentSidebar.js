import React from "react";
import { FiUser, FiLogOut } from "react-icons/fi";
import Stars from "../Stars";
import styles from '@/styles/Profile.module.css';

function StudentSidebar({ profile, averageScore, sidebarOpen, setSidebarOpen, setActiveSection, setEditMode, handleEditPhoto, handleLogout }) {
  return (
    <div className={styles.sidebar + (sidebarOpen ? " " + styles.open : "")}> 
      <div className={styles.profilePhotoWrapperSidebar}>
        {profile.profile_photo_url ? (
          <img src={`http://localhost:8000${profile.profile_photo_url}`} alt="Profile" className={styles.profilePhoto} />
        ) : (
          <div className={styles.photoPlaceholder}><FiUser size={55} /></div>
        )}
        <button onClick={handleEditPhoto} className={styles.editPhotoButton}><img src="/favicons/edit_icon.png" alt="Edit" width={13} height={13} /></button>
        <div className={styles.profileName}>{profile.first_name} {profile.last_name}</div>
        <div className={styles.averageScore}>{averageScore}/5 <Stars rating={averageScore} /></div>
      </div>

      <button onClick={() => { setActiveSection("profile"); setSidebarOpen(false); setEditMode(false); }} className={styles.sidebarBtn}>Profile Information</button>
      <button onClick={() => { setActiveSection("myReviews"); setSidebarOpen(false); setEditMode(false); }} className={styles.sidebarBtn}>Reviews</button>
      <button onClick={() => { setActiveSection("reviewsHistory"); setSidebarOpen(false); setEditMode(false); }} className={styles.sidebarBtn}>My Reviews History</button>
      <button onClick={() => { setActiveSection("myInstructionPosts"); setSidebarOpen(false); setEditMode(false); }} className={styles.sidebarBtn}>My Posts</button>
      <button onClick={() => { setActiveSection("myApplications"); setSidebarOpen(false); setEditMode(false); }} className={styles.sidebarBtn}>My Applications</button>

      <button onClick={handleLogout} className={styles.sidebarBtnLogout}><FiLogOut /> Logout</button>
    </div>
  );
}

export default StudentSidebar;
