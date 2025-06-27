import React from "react";

function EmployerProfileSection({ form, editMode, handleChange, handleSaveChanges, handleCancelEdit, setEditMode }) {
  return (
    <div className="bg-gray-100 ring-1 p-[35px] md:p-[45px] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] max-w-[800px] w-full">
      <h2 className="text-[1.8rem] font-bold text-gray-800 mb-[25px] text-center">
        Profile Information
      </h2>
      <div className="flex flex-col gap-5">

        <div className="flex flex-col">
          <label className="font-semibold mb-[5px] text-slate-600">First Name:</label>
          <input
            name="first_name"
            value={form.first_name || ""}
            onChange={handleChange}
            disabled={!editMode}
            className={`w-full p-3 border border-gray-300 rounded-xl bg-white text-base text-slate-800 ${!editMode ? "bg-gray-200 text-gray-500" : ""}`}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-[5px] text-slate-600">Last Name:</label>
          <input
            name="last_name"
            value={form.last_name || ""}
            onChange={handleChange}
            disabled={!editMode}
            className={`w-full p-3 border border-gray-300 rounded-xl bg-white text-base text-slate-800 ${!editMode ? "bg-gray-200 text-gray-500" : ""}`}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-[5px] text-slate-600">Company Name:</label>
          <input
            name="company_name"
            value={form.company_name || ""}
            onChange={handleChange}
            disabled={!editMode}
            className={`w-full p-3 border border-gray-300 rounded-xl bg-white text-base text-slate-800 ${!editMode ? "bg-gray-200 text-gray-500" : ""}`}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-[5px] text-slate-600">Email:</label>
          <input
            name="email"
            value={form.email || ""}
            disabled
            className="w-full p-3 border border-gray-300 rounded-xl bg-gray-200 text-gray-500 text-base"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-[5px] text-slate-600">City:</label>
          <input
            name="city"
            value={form.city || ""}
            onChange={handleChange}
            disabled={!editMode}
            className={`w-full p-3 border border-gray-300 rounded-xl bg-white text-base text-slate-800 ${!editMode ? "bg-gray-200 text-gray-500" : ""}`}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-[5px] text-slate-600">Address:</label>
          <input
            name="address"
            value={form.address || ""}
            onChange={handleChange}
            disabled={!editMode}
            className={`w-full p-3 border border-gray-300 rounded-xl bg-white text-base text-slate-800 ${!editMode ? "bg-gray-200 text-gray-500" : ""}`}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-[5px] text-slate-600">Website URL:</label>
          <input
            name="website_url"
            value={form.website_url || ""}
            onChange={handleChange}
            disabled={!editMode}
            className={`w-full p-3 border border-gray-300 rounded-xl bg-white text-base text-slate-800 ${!editMode ? "bg-gray-200 text-gray-500" : ""}`}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-[5px] text-slate-600">Contact Number:</label>
          <input
            name="contact_phone"
            value={form.contact_phone || ""}
            onChange={handleChange}
            disabled={!editMode}
            className={`w-full p-3 border border-gray-300 rounded-xl bg-white text-base text-slate-800 ${!editMode ? "bg-gray-200 text-gray-500" : ""}`}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-[5px] text-slate-600">Company Description:</label>
          <textarea
            name="company_description"
            value={form.company_description || ""}
            onChange={handleChange}
            disabled={!editMode}
            rows={3}
            className={`w-full p-3 border border-gray-300 rounded-xl bg-white text-base text-slate-800 resize-none ${!editMode ? "bg-gray-200 text-gray-500" : ""}`}
          />
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

export default EmployerProfileSection;
