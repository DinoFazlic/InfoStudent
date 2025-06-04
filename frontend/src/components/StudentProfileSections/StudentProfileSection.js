import React from "react";

function StudentProfileSection({ profile, setProfile, editMode, setEditMode, handleUploadCV, handleSaveChanges, handleUploadSchedule, handleCancelEdit }) {
  return (
    <div className="bg-gray-100 ring-1 p-[35px] md:p-[45px] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] max-w-[800px] w-full">
      <h2 className="text-[1.8rem] font-bold text-gray-800 mb-[25px] text-center">
        Profile Information
      </h2>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col">
          <label className="font-semibold mb-[5px] text-slate-600">First Name:</label>
          <input
            value={profile.first_name || ""}
            disabled={!editMode}
            onChange={(e) => setProfile((prev) => ({ ...prev, first_name: e.target.value }))}
            className={`w-full p-3 border border-gray-300 rounded-xl bg-white text-base text-slate-800 ${!editMode ? "bg-gray-200 text-gray-500" : ""}`}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-[5px] text-slate-600">Last Name:</label>
          <input
            value={profile.last_name || ""}
            disabled={!editMode}
            onChange={(e) => setProfile((prev) => ({ ...prev, last_name: e.target.value }))}
            className={`w-full p-3 border border-gray-300 rounded-xl bg-white text-base text-slate-800 ${!editMode ? "bg-gray-200 text-gray-500" : ""}`}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-[5px] text-slate-600">Email:</label>
          <input
            value={profile.email || ""}
            disabled
            className="w-full p-3 border border-gray-300 rounded-xl bg-gray-200 text-gray-500 text-base"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-[5px] text-slate-600">Contact Phone:</label>
          <input
            value={profile.contact_phone || ""}
            disabled={!editMode}
            onChange={(e) => setProfile((prev) => ({ ...prev, contact_phone: e.target.value }))}
            className={`w-full p-3 border border-gray-300 rounded-xl bg-white text-base text-slate-800 ${!editMode ? "bg-gray-200 text-gray-500" : ""}`}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-[5px] text-slate-600">City:</label>
          <input
            value={profile.city || ""}
            disabled={!editMode}
            onChange={(e) => setProfile((prev) => ({ ...prev, city: e.target.value }))}
            className={`w-full p-3 border border-gray-300 rounded-xl bg-white text-base text-slate-800 ${!editMode ? "bg-gray-200 text-gray-500" : ""}`}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-[5px] text-slate-600">Biography:</label>
          <textarea
            value={profile.biography || ""}
            rows={3}
            disabled={!editMode}
            onChange={(e) => setProfile((prev) => ({ ...prev, biography: e.target.value }))}
            className={`w-full p-3 border border-gray-300 rounded-xl bg-white text-base text-slate-800 resize-none ${!editMode ? "bg-gray-200 text-gray-500" : ""}`}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-[5px] text-slate-600">Skills (comma separated):</label>
          <input
            value={profile.skills ? profile.skills.join(", ") : ""}
            disabled={!editMode}
            onChange={(e) => setProfile((prev) => ({ ...prev, skills: e.target.value.split(",").map((s) => s.trim()) }))}
            className={`w-full p-3 border border-gray-300 rounded-xl bg-white text-base text-slate-800 ${!editMode ? "bg-gray-200 text-gray-500" : ""}`}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-[5px] text-slate-600">Experience:</label>
          <textarea
            value={profile.experience || ""}
            rows={2}
            disabled={!editMode}
            onChange={(e) => setProfile((prev) => ({ ...prev, experience: e.target.value }))}
            className={`w-full p-3 border border-gray-300 rounded-xl bg-white text-base text-slate-800 resize-none ${!editMode ? "bg-gray-200 text-gray-500" : ""}`}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-[5px] text-slate-600">CV / Resume:</label>
          {profile.cv_url ? (
            <div className="flex items-center gap-3 mt-2 justify-evenly w-full">
              <a
                href={`http://localhost:8000${profile.cv_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 font-medium no-underline py-1.5 px-3 bg-blue-100 rounded-lg transition hover:bg-blue-200 w-full text-center"
              >
                View Uploaded CV
              </a>
              <span className="text-gray-500 text-[1.2rem]">|</span>
              <button
                onClick={handleUploadCV}
                className="py-1.5 px-3 text-[0.95rem] bg-green-500 text-white rounded-lg transition hover:bg-green-600 w-full"
              >
                Upload New
              </button>
            </div>
          ) : (
            <button
              onClick={handleUploadCV}
              className="py-1.5 px-3 text-[0.95rem] bg-green-500 text-white rounded-lg transition hover:bg-green-600 w-full mt-2"
            >
              Upload CV
            </button>
          )}
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-[5px] text-slate-600">Schedule (PDF):</label>
          {profile.schedule_url ? (
            <div className="flex items-center gap-3 mt-2 justify-evenly w-full">
              <a
                href={`http://localhost:8000${profile.schedule_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 font-medium no-underline py-1.5 px-3 bg-blue-100 rounded-lg transition hover:bg-blue-200 w-full text-center"
              >
                View Uploaded Schedule
              </a>
              <span className="text-gray-500 text-[1.2rem]">|</span>
              <button
                onClick={handleUploadSchedule}
                className="py-1.5 px-3 text-[0.95rem] bg-green-500 text-white rounded-lg transition hover:bg-green-600 w-full"
              >
                Upload New
              </button>
            </div>
          ) : (
            <button
              onClick={handleUploadSchedule}
              className="py-1.5 px-3 text-[0.95rem] bg-green-500 text-white rounded-lg transition hover:bg-green-600 w-full mt-2"
            >
              Upload Schedule
            </button>
          )}
        </div>

        <div className="mt-[25px] flex justify-center gap-4">
          {editMode ? (
            <>
              <button
                onClick={handleSaveChanges}
                className="py-3 px-7 text-[1.05rem] rounded-2xl bg-green-500 hover:bg-green-600 text-white transition"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                className="py-3 px-7 text-[1.05rem] rounded-2xl bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="py-3 px-7 text-[1.05rem] rounded-2xl bg-blue-500 hover:bg-blue-600 text-white transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentProfileSection;
