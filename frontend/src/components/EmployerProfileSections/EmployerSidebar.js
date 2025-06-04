import React from "react";
import { FiUser, FiLogOut } from "react-icons/fi";
import Stars from "../Stars";

function EmployerSidebar({
  profile,
  averageScore,
  sidebarOpen,
  setSidebarOpen,
  setActiveSection,
  setEditMode,
  handleEditPhoto,
  handleLogout,
}) {
  const displayName = profile.company_name?.trim()
    ? profile.company_name
    : `${profile.first_name || ""} ${profile.last_name || ""}`;

  return (
    <div
      className={`fixed top-[96px] left-0 h-screen w-[250px] bg-gray-200 shadow-lg flex flex-col items-center pt-[10px] transition-transform duration-300 z-[1000] ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="relative flex flex-col items-center mb-2.5">
        {profile.profile_photo_url ? (
          <img
            src={`http://localhost:8000${profile.profile_photo_url}`}
            alt="Profile"
            className="w-[120px] h-[120px] rounded-full object-cover bg-indigo-100 border-[2px] border-[#d0d7e6]"
          />
        ) : (
          <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-[2.5rem] text-blue-400 font-bold">
            <FiUser size={48} />
          </div>
        )}
        <button
          onClick={handleEditPhoto}
          className="fixed top-[96px] right-[68px] bg-white border border-gray-300 rounded-full p-1.5 cursor-pointer text-xs shadow-md"
        >
          <img src="/favicons/edit_icon.png" alt="Edit" width={13} height={13} />
        </button>
        <div className="mt-3 text-[1.3rem] font-semibold text-slate-800 text-center">
          {displayName}
        </div>
        <div className="text-[1rem] text-slate-500 flex items-center gap-1.5 mt-1.5">
          {averageScore}/5 <Stars rating={averageScore} />
        </div>
      </div>

      <button
        onClick={() => {
          setActiveSection("profile");
          setSidebarOpen(false);
          setEditMode(false);
        }}
        className="ring-1 w-[80%] bg-none border-none text-left text-[1.1rem] text-black-500 py-1.5 px-4 my-1.5 rounded-lg transition duration-200 hover:bg-gray-300 cursor-pointer"
      >
        Profile Information
      </button>

      <button
        onClick={() => {
          setActiveSection("reviews");
          setSidebarOpen(false);
          setEditMode(false);
        }}
        className="ring-1 w-[80%] bg-none border-none text-left text-[1.1rem] text-black-500 py-1.5 px-4 my-1.5 rounded-lg transition duration-200 hover:bg-gray-300 cursor-pointer"
      >
        Reviews
      </button>

      <button
        onClick={() => {
          setActiveSection("reviewsGiven");
          setSidebarOpen(false);
          setEditMode(false);
        }}
        className="ring-1 w-[80%] bg-none border-none text-left text-[1.1rem] text-black-500 py-1.5 px-4 my-1.5 rounded-lg transition duration-200 hover:bg-gray-300 cursor-pointer"
      >
        My Reviews History
      </button>

      <button
        onClick={() => {
          setActiveSection("posts");
          setSidebarOpen(false);
          setEditMode(false);
        }}
        className="ring-1 w-[80%] bg-none border-none text-left text-[1.1rem] text-black-500 py-1.5 px-4 my-1.5 rounded-lg transition duration-200 hover:bg-gray-300 cursor-pointer"
      >
        My Posts
      </button>

      <button
        onClick={handleLogout}
        className="ring-1 w-[80%] bg-none border-none text-left text-[1.1rem] text-red-500 py-1.5 px-4 mt-10 flex items-center gap-2 rounded-lg transition duration-200 hover:bg-red-100 cursor-pointer"
      >
        <FiLogOut /> Logout
      </button>
    </div>
  );
}

export default EmployerSidebar;
