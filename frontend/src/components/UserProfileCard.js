"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function UserProfilePopup({ userId, onClose }) {
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [studentInstructions, setStudentInstructions] = useState([]);



  const fetchUser = () => {
    if (!userId) return;

    axios
      .get(`http://localhost:8000/auth/users/view/${userId}`, {
        withCredentials: true,
      })
      .then((res) => setData(res.data))
      .catch(() => setData(null));

    axios
      .get(`http://localhost:8000/reviews/user/${userId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setReviews(res.data);
        const avg =
          res.data.length > 0
            ? (
                res.data.reduce((acc, r) => acc + r.rating, 0) / res.data.length
              ).toFixed(1)
            : null;
        setAverageRating(avg ? parseFloat(avg) : null);
      })
      .catch(() => {
        setReviews([]);
        setAverageRating(null);
      });
  };

  useEffect(() => {
    fetchUser();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };

    }, [userId]);
    useEffect(() => {
    if (!userId) return;
    axios
      .get("http://localhost:8000/api/instructions", { withCredentials: true })
      .then((res) => {
        const filtered = res.data.filter((ins) => ins.created_by === userId);
        setStudentInstructions(filtered);
      })
      .catch(() => setStudentInstructions([]));
  }, [userId]);

  const handleReviewSubmit = async () => {
    try {
      await axios.post(
        `http://localhost:8000/reviews`,
        {
          reviewee_id: userId,
          comment,
          rating,
        },
        { withCredentials: true }
      );
      toast.success("Review submitted successfully!");
      setShowReviewForm(false);
      setComment("");
      setRating(5);
      fetchUser();
    } catch (err) {
      console.error("Failed to submit review", err);
      alert("Error submitting review.");
    }
  };

    const [employerJobs, setEmployerJobs] = useState([]);
    const [employerInternships, setEmployerInternships] = useState([]);

    useEffect(() => {
      if (!userId) return;
      axios.get("http://localhost:8000/api/jobs", { withCredentials: true })
        .then((res) => {
          const filtered = res.data.filter((job) => job.created_by === userId);
          setEmployerJobs(filtered);
        })
        .catch(() => setEmployerJobs([]));

      axios.get("http://localhost:8000/api/internships", { withCredentials: true })
        .then((res) => {
          const filtered = res.data.filter((intern) => intern.created_by === userId);
          setEmployerInternships(filtered);
        })
        .catch(() => setEmployerInternships([]));
    }, [userId]);


  if (!userId || !data) return null;

  return (
    <div className="fixed inset-0 z-[5000] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto font-sans p-0">

        {/* HEADER */}
        <div className="bg-blue-700 text-white flex justify-between items-center px-6 py-4 rounded-t-2xl">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            👤 {data.first_name} {data.last_name}
          </h2>
          <button onClick={onClose} className="text-2xl hover:text-gray-200">
            &times;
          </button>
        </div>

        {/* AVATAR */}
        <div className="flex justify-center mt-4">
          {data.avatar_url ? (
            <img
              src={data.avatar_url}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-blue-500"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold border-4 border-white shadow-lg ring-2 ring-blue-500">
              {data.first_name?.[0]}{data.last_name?.[0]}
            </div>
          )}
        </div>

        {/* BASIC INFO */}
        <div className="p-6 text-center space-y-1 text-gray-700 text-sm">
          <p>📧 <span className="font-medium">{data.email}</span></p>
          <p>📍 <span className="font-medium">{data.city}</span></p>
          {data.contact_phone && (
            <p>📞 <span className="font-medium">{data.contact_phone}</span></p>
          )}
          <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase shadow">
            {data.role}
          </span>
          <div className="mt-4">
            <button
              onClick={() => (window.location.href = `/chat/${data.id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              💬 Message
            </button>
          </div>
        </div>

        {/* STUDENT INFO */}
        {data.biography && (
          <div className="bg-blue-50 px-6 py-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">🎓 Student Information</h3>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="text-blue-800 font-semibold mb-1">📝 Biography</h4>
                <p>{data.biography}</p>
              </div>
              <div>
                <h4 className="text-blue-800 font-semibold mb-1">🛠️ Skills</h4>
                {data.skills?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">N/A</p>
                )}
              </div>
              <div>
                <h4 className="text-blue-800 font-semibold mb-1">💼 Experience</h4>
                <p>{data.experience || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-blue-800 font-semibold mb-1">📄 CV</h4>
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

        {/* EMPLOYER INFO */}
        {data.company_name && (
          <div className="bg-blue-50 px-6 py-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">🏢 Employer Information</h3>
            <div className="space-y-1 text-gray-700 text-sm">
              <p><span className="font-semibold">Company:</span> {data.company_name}</p>
              <p><span className="font-semibold">Description:</span> {data.company_description || "N/A"}</p>
              <p>
                <span className="font-semibold">Website:</span>{" "}
                {data.website_url ? (
                  <a href={data.website_url} target="_blank" className="text-blue-600 hover:text-blue-800 hover:underline transition">Visit Site</a>
                ) : "N/A"}
              </p>
              <p><span className="font-semibold">Address:</span> {data.address || "N/A"}</p>
            </div>
          </div>
        )}

        {data.role === "employer" && (
  <div className="px-6 pt-4 pb-6 space-y-6">

    {/* Jobs */}
    {employerJobs.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold text-blue-800 mb-2">🧰 Jobs Posted</h3>
        <div className="space-y-3">
          {employerJobs.map((job) => (
            <div key={job.id} className="border border-gray-200 rounded-lg p-3 shadow-sm bg-white">
              <h4 className="font-semibold text-gray-800">{job.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
              {job.location && <p className="text-xs text-gray-500">📍 {job.location}</p>}
              {job.price && <p className="text-xs text-gray-500">💰 {job.price} KM/h</p>}
            </div>
          ))}
        </div>
      </div>
    )}

        {/* Internships */}
        {employerInternships.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">🎓 Internships Posted</h3>
            <div className="space-y-3">
              {employerInternships.map((intern) => (
                <div key={intern.id} className="border border-gray-200 rounded-lg p-3 shadow-sm bg-white">
                  <h4 className="font-semibold text-gray-800">{intern.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{intern.description}</p>
                  {intern.location && <p className="text-xs text-gray-500">📍 {intern.location}</p>}
                  {intern.stipend && <p className="text-xs text-gray-500">💰 {intern.stipend} KM</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )}


        {/* AVAILABILITY */}
        {data.availability?.length > 0 && (
          <div className="bg-blue-50 px-6 py-4 border-t border-gray-200">
            <h4 className="text-base font-semibold text-blue-700 mb-2">📅 Weekly Availability</h4>
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
                            {dayMap[day]?.has(slot) ? "✔️" : ""}
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

        {/* REVIEWS */}
        <div className="px-6 pt-6 pb-6">
          <h3 className="text-lg font-bold text-blue-800 mb-2 border-b pb-1 border-blue-100">📣 Reviews</h3>
          {averageRating !== null && (
            <p className="text-sm text-gray-800 mb-2">⭐ {averageRating}/5 from {reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
          )}
          <div className="space-y-3">
            {reviews.length > 0 ? reviews.map((review) => (
              <div key={review.id} className="bg-blue-50 border border-blue-100 rounded-lg p-3 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-blue-800">{review.reviewer_name || "Anonymous"}</span>
                  <span className="text-sm text-yellow-600 font-semibold">⭐ {review.rating}/5</span>
                </div>
                <p className="text-gray-700 text-sm italic">"{review.comment}"</p>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">No reviews yet.</p>
            )}
          </div>
        </div>

              {studentInstructions.length > 0 && (
        <div className="bg-blue-50 pt-4 px-6 py-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">📚 Instructions Given</h3>
          <div className="space-y-3">
            {studentInstructions.map((ins) => (
              <div
                key={ins.id}
                className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm"
              >
                <h4 className="text-blue-700 font-semibold text-sm mb-1">{ins.title}</h4>
                <p className="text-sm text-gray-700">{ins.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}


        {/* LEAVE A REVIEW */}
        <div className="p-6 border-t border-gray-200 text-center space-y-4">
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition"
          >
            ✍️ Leave a Review
          </button>

          {showReviewForm && (
            <>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Write your honest thoughts..."
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              />
              <div className="flex items-center justify-center gap-2">
                <label className="text-sm text-gray-600 font-medium">Rating:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded shadow-sm"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleReviewSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow"
              >
                Submit Review
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
