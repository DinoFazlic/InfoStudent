"use client";

import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import StudentSidebar from "@/components/StudentProfileSections/StudentSidebar";
import StudentProfileSection from "@/components/StudentProfileSections/StudentProfileSection";
import StudentReviewsSection from "@/components/StudentProfileSections/StudentReviewsSection";
import StudentReviewsGivenSection from "@/components/StudentProfileSections/StudentReviewsGivenSection";
import StudentInstructionPostsSection from "@/components/StudentProfileSections/StudentInstructionPostsSection";
import StudentAppliedPostsSection from "@/components/StudentProfileSections/StudentAppliedPostsSection";

function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [backupProfile, setBackupProfile] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [reviewsReceived, setReviewsReceived] = useState([]);
  const [reviewsGiven, setReviewsGiven] = useState([]);
  const [instructionPosts, setInstructionPosts] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [appliedInternships, setAppliedInternships] = useState([]);
  const [appliedInstructions, setAppliedInstructions] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);

  const [dataLoaded, setDataLoaded] = useState({
    profile: true,
    myReviews: false,
    reviewsHistory: false,
    instructionPosts: false,
    myApplications: false,
  });

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:8000/auth/users/me", {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        const studentData = { ...data, ...data.student_profile };
        setProfile(studentData);
        setBackupProfile(studentData);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);


  useEffect(() => {
    if (activeSection === "myReviews" && !dataLoaded.myReviews) {
      fetch("http://localhost:8000/reviews/received", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          setReviewsReceived(data);
          setDataLoaded((prev) => ({ ...prev, myReviews: true }));
        })
        .catch((err) => console.error("Failed to fetch received reviews:", err));
    }

    if (activeSection === "reviewsHistory" && !dataLoaded.reviewsHistory) {
      fetch("http://localhost:8000/reviews/given", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          setReviewsGiven(data);
          setDataLoaded((prev) => ({ ...prev, reviewsHistory: true }));
        })
        .catch((err) => console.error("Failed to fetch given reviews:", err));
    }
  }, [activeSection, dataLoaded]);

  useEffect(() => {
    if (activeSection === "myInstructionPosts" && !dataLoaded.instructionPosts) {
      const mockInstructions = [
        { id: 1, title: "Math Tutor", description: "Helping with calculus basics." },
        { id: 2, title: "Physics Help", description: "Newton's laws and energy." },
      ];
      setInstructionPosts(mockInstructions);
      setDataLoaded((prev) => ({ ...prev, instructionPosts: true }));
    }

    if (activeSection === "myApplications" && !dataLoaded.myApplications) {
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
      setDataLoaded((prev) => ({ ...prev, myApplications: true }));
    }
  }, [activeSection, dataLoaded]);

  const handleLogout = () => {
    fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(() => (window.location.href = "/login"))
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
        const res = await fetch("http://localhost:8000/users/student/profile/profile-photo", {
          method: "PUT",
          credentials: "include",
          body: formData,
        });
        const data = await res.json();
        if (res.ok) {
          setProfile((prev) => ({ ...prev, profile_photo_url: data.photo_url }));
          window.dispatchEvent(
            new CustomEvent("profilePhotoUpdated", {
              detail: { url: data.photo_url },
            })
          );
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
          setProfile((prev) => ({ ...prev, cv_url: data.cv_url }));
          toast.success("CV uploaded successfully!");
          await fetchProfile();
        } else {
          console.error("Failed to upload CV:", data.detail);
          toast.error("Failed to upload CV.");
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

        setProfile((prev) => ({
          ...prev,
          student_profile: {
            ...prev.student_profile,
            schedule_url: data.schedule_url,
          },
        }));

        toast.success("Schedule uploaded successfully!");
        //await fetchProfile();
      } else {
         toast.error("Failed to upload schedule.");
      }
    };
    input.click();
  };

    const handleCancelEdit = () => {
      setProfile(backupProfile);
      setEditMode(false);      
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

    fetch("http://localhost:8000/student/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update");
        return res.json();
      })
      .then((data) => {
        setEditMode(false);
        setBackupProfile(profile);
      })
      .catch((err) => console.error("Update failed:", err));
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const averageScore = reviewsReceived.length
    ? (
        reviewsReceived.reduce((total, r) => total + r.rating, 0) /
        reviewsReceived.length
      ).toFixed(1)
    : "0.0";

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <StudentProfileSection
            profile={profile}
            setProfile={setProfile}
            editMode={editMode}
            setEditMode={setEditMode}
            handleUploadCV={handleUploadCV}
            handleSaveChanges={handleSaveChanges}
            handleUploadSchedule={handleUploadSchedule}
            handleCancelEdit={handleCancelEdit}
            setShowScheduleModal={setShowScheduleModal}
            setScheduleData={setScheduleData}
          />
        );
      case "myReviews":
        return (
          <StudentReviewsSection
            reviewsReceived={reviewsReceived}
            averageScore={averageScore}
          />
        );
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
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#eef2f7] to-[#d7dde8]" style={{ backgroundImage: "url('/backgrounds/post-bg4.svg')", backgroundPosition: "center" }}>
      <div className="fixed w-[50px] h-[50px] z-[1200] flex items-center justify-center md:hidden">
        <button
          className="top-1/2 fixed"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <img
            src={
              sidebarOpen
                ? "/favicons/left_arrow_icon.png"
                : "/favicons/right_arrow_icon.png"
            }
            alt={sidebarOpen ? "Close" : "Open"}
            width={24}
            height={24}
            className="transition-transform duration-300"
            style={{
              transform: sidebarOpen ? "translateX(210px)" : "translateX(0px)",
            }}
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

      <div className="flex-1 p-10 flex justify-center transition-margin-left duration-300 md:ml-[250px]">
        {renderSection()}
      </div>

      {showScheduleModal && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 z-[1200]">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl overflow-y-auto max-h-[90%]">
      <h2 className="text-xl font-bold mb-4 text-center">Your Weekly Schedule</h2>
      <table className="min-w-full table-fixed border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Time</th>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
              <th key={day} className="border border-gray-300 p-2">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {["08:15", "09:15", "10:15", "11:15", "12:15", "13:15", "14:15", "15:15", "16:15", "17:15"].map((time) => (
            <tr key={time}>
              <td className="border border-gray-300 p-2 font-semibold">{time}</td>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                <td
                  key={day}
                  className={`border border-gray-300 p-2 text-center ${
                    scheduleData.some(slot => slot.day === day && slot.start_time === time)
                      ? "bg-blue-500 text-white font-bold"
                      : "bg-gray-100"
                  }`}
                >
                  {scheduleData.some(slot => slot.day === day && slot.start_time === time) ? "Busy" : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-right">
        <button
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          onClick={() => setShowScheduleModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default StudentProfile;
