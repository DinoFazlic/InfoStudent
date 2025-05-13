import React from "react";
import styles from "@/styles/Profile.module.css";

function EmployerProfileSection({ form, editMode, handleChange, handleSaveChanges, setEditMode }) {
  return (
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>Profile Information</h2>
      <div className={styles.profileFormWrapper}>
        {[
          { label: "First Name", name: "first_name" },
          { label: "Last Name", name: "last_name" },
          { label: "Company Name", name: "company_name" },
          { label: "Email", name: "email", disabled: true },
          { label: "City", name: "city" },
          { label: "Address", name: "address" },
          { label: "Website URL", name: "website_url" },
          { label: "Contact Number", name: "contact_phone" },
        ].map(({ label, name, disabled }) => (
          <div className={styles.formGroup} key={name}>
            <label>{label}:</label>
            <input
              name={name}
              value={form[name] || ""}
              onChange={handleChange}
              disabled={disabled || !editMode}
            />
          </div>
        ))}
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
        <div className={styles.buttonGroup}>
          <button onClick={editMode ? handleSaveChanges : () => setEditMode(true)} className={editMode ? styles.saveButton : styles.editButton}>
            {editMode ? "Save Changes" : "Edit Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployerProfileSection;
