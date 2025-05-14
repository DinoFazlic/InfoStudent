import React from "react";
import styles from '@/styles/Profile.module.css';

function StudentProfileSection({ profile, setProfile, editMode, setEditMode, handleUploadCV, handleSaveChanges, handleUploadSchedule }) {
  return (
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>Profile Information</h2>
      <div className={styles.profileFormWrapper}>
        <div className={styles.formGroup}>
          <label>First Name:</label>
          <input value={profile.first_name || ""} disabled={!editMode} onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))} />
        </div>
        <div className={styles.formGroup}>
          <label>Last Name:</label>
          <input value={profile.last_name || ""} disabled={!editMode} onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))} />
        </div>
        <div className={styles.formGroup}>
          <label>Email:</label>
          <input value={profile.email || ""} disabled />
        </div>
        <div className={styles.formGroup}>
          <label>Contact Phone:</label>
          <input value={profile.contact_phone || ""} disabled={!editMode} onChange={(e) => setProfile(prev => ({ ...prev, contact_phone: e.target.value }))} />
        </div>
        <div className={styles.formGroup}>
          <label>City:</label>
          <input value={profile.city || ""} disabled={!editMode} onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))} />
        </div>
        <div className={styles.formGroup}>
          <label>Biography:</label>
          <textarea value={profile.biography || ""} rows={3} disabled={!editMode} onChange={(e) => setProfile(prev => ({ ...prev, biography: e.target.value }))} />
        </div>
        <div className={styles.formGroup}>
          <label>Skills (comma separated):</label>
          <input value={profile.skills ? profile.skills.join(", ") : ""} disabled={!editMode} onChange={(e) => setProfile(prev => ({ ...prev, skills: e.target.value.split(",").map(s => s.trim()) }))} />
        </div>
        <div className={styles.formGroup}>
          <label>Experience:</label>
          <textarea value={profile.experience || ""} rows={2} disabled={!editMode} onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))} />
        </div>

        <div className={styles.formGroup}>
          <label>CV / Resume:</label>
          {profile.cv_url ? (
            <div className={styles.cvRow}>
              <a href={`http://localhost:8000${profile.cv_url}`} target="_blank" rel="noopener noreferrer" className={styles.downloadLink}>View Uploaded CV</a>
              <span className={styles.separator}>|</span>
              <button onClick={handleUploadCV} className={styles.uploadCVButton}>Upload New</button>
            </div>
          ) : (
            <button onClick={handleUploadCV} className={styles.uploadCVButton}>Upload CV</button>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Schedule (PDF):</label>
          {profile.schedule_url ? (
            <div className={styles.cvRow}>
              <a href={`http://localhost:8000${profile.schedule_url}`} target="_blank" rel="noopener noreferrer" className={styles.downloadLink}>View Uploaded Schedule</a>
              <span className={styles.separator}>|</span>
              <button onClick={handleUploadSchedule} className={styles.uploadCVButton}>Upload New</button>
            </div>
          ) : (
            <button onClick={handleUploadSchedule} className={styles.uploadCVButton}>Upload Schedule</button>
          )}
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={editMode ? handleSaveChanges : () => setEditMode(true)} className={editMode ? styles.saveButton : styles.editButton}>
            {editMode ? "Save Changes" : "Edit Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentProfileSection;