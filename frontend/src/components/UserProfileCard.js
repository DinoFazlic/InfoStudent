"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserProfilePopup({ userId, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:8000/auth/users/view/${userId}`, {
        withCredentials: true,
      })
      .then((res) => setData(res.data))
      .catch(() => setData(null));
  }, [userId]);

  if (!userId || !data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto font-sans">

        {/* Blue Navbar */}
        <div className="bg-blue-700 text-white flex justify-between items-center px-6 py-4">
          <h2 className="text-lg font-semibold">
            {data.first_name} {data.last_name}
          </h2>
          <button
            onClick={onClose}
            className="text-white text-2xl hover:text-gray-200"
          >
            &times;
          </button>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mt-4">
          {data.avatar_url ? (
            <img
              src={data.avatar_url}
              alt={`${data.first_name} ${data.last_name}'s avatar`}
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 shadow"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold border border-blue-300 shadow">
              {data.first_name?.[0]}{data.last_name?.[0]}
            </div>
          )}
        </div>

        {/* Basic Info */}
                <div className="p-6 text-center">
        <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
            📧 {data.email}
        </p>
        <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
            📍 {data.city}
        </p>
        {data.contact_phone && (
            <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
            📞 {data.contact_phone}
            </p>
        )}
        <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full capitalize shadow-sm">
            {data.role}
        </span>
        <br></br>

            <button
            onClick={() => window.location.href = `/chat/${data.id}`}
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
            Message me
            </button>

        </div>

        {/* Student Info */}
        {data.biography && (
          <div className="bg-blue-50 px-6 py-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
              🎓 Student Information
            </h3>
            <div className="space-y-4 text-sm text-gray-700">
                {/* BIOGRAPHY */}
                <div>
                    <h4 className="text-blue-800 font-semibold flex items-center gap-1 mb-1">📝 Biography</h4>
                    <p className="text-gray-700">{data.biography}</p>
                </div>

                {/* SKILLS */}
                <div>
                    <h4 className="text-blue-800 font-semibold flex items-center gap-1 mb-1">🛠️ Skills</h4>
                    {data.skills && data.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, idx) => (
                        <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm"
                        >
                            {skill}
                        </span>
                        ))}
                    </div>
                    ) : (
                    <p className="text-gray-500">N/A</p>
                    )}
                </div>

                {/* EXPERIENCE */}
                <div>
                    <h4 className="text-blue-800 font-semibold flex items-center gap-1 mb-1">💼 Experience</h4>
                    <p>{data.experience || "N/A"}</p>
                </div>

                {/* CV */}
                <div>
                    <h4 className="text-blue-800 font-semibold flex items-center gap-1 mb-1">📄 CV</h4>
                    {data.cv_url ? (
                    <a
                        href={data.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        View CV
                    </a>
                    ) : (
                    <p className="text-gray-500">N/A</p>
                    )}
                </div>
                </div>

          </div>
        )}

        {/* Employer Info */}
        {data.company_name && (
          <div className="bg-blue-50 px-6 py-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
              🏢 Employer Information
            </h3>
            <div className="space-y-1 text-gray-700 text-sm">
              <p><span className="font-semibold">Company:</span> {data.company_name}</p>
              <p><span className="font-semibold">Description:</span> {data.company_description || "N/A"}</p>
              <p>
                <span className="font-semibold">Website:</span>{" "}
                {data.website_url ? (
                  <a
                    href={data.website_url}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 hover:underline transition"
                  >
                    Visit Site
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p><span className="font-semibold">Address:</span> {data.address || "N/A"}</p>
            </div>
          </div>
        )}

        {data.availability && data.availability.length > 0 && (
            <div className="bg-blue-50 px-6 py-4 border-t border-gray-200">

                            <h4 className="text-base font-semibold text-blue-700 mb-2 flex items-center gap-2">
                            📅 Weekly Availability
                            </h4>

                            <div className="overflow-x-auto rounded-lg border border-blue-100 bg-white shadow-sm">
                            <table className="w-full text-xs text-gray-700 table-auto border-collapse">
                <thead className="bg-blue-100 text-blue-800">
                <tr>
                    <th className="p-1 border border-blue-200 text-left font-medium">Time</th>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => (
                    <th key={day} className="p-1 border border-blue-200 text-center font-medium">{day}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {(() => {
                    const dayMap = {};
                    const allSlots = new Set();

                    data.availability.forEach(({ day, start_time, end_time }) => {
                    const timeRange = `${start_time.slice(0, 5)} - ${end_time.slice(0, 5)}`;
                    if (!dayMap[day]) dayMap[day] = new Set();
                    dayMap[day].add(timeRange);
                    allSlots.add(timeRange);
                    });

                    const sortedSlots = Array.from(allSlots).sort();

                    return sortedSlots.map((slot, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                        <td className="p-1 border border-blue-100 font-medium text-xs">{slot}</td>
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => (
                        <td key={day} className="p-1 text-center border border-blue-100 text-sm align-middle">
                            {dayMap[day]?.has(slot) ? "x" : ""}
                        </td>
                        ))}
                    </tr>
                    ));
                })()}
                </tbody>
            </table>
                </div>
            </div>
            )}

      </div>

        

    </div>
  );
}
