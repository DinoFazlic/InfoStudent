"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/Navbar";
import Footer from '@/components/Footer';
import InternshipCard from "@/components/InternshipCard";
import { listInternships, createInternship } from "@/utils/api/internships";
import { getMe } from "@/utils/api/auth";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import UserProfileCard from "@/components/UserProfileCard";

export default function InternshipsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    stipend: "",
    application_deadline: "",
    start_date: "",
    end_date: "",
  });
  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentInternshipId, setCurrentInternshipId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [minStipend, setMinStipend] = useState("");
  const [allLocations, setAllLocations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);




  useEffect(() => {
    async function fetchInternships() {
      setLoading(true);
      const user = await getMe().catch(() => null);
      setMe(user);

      const filters = {
        search: searchQuery || undefined,
        location: locationFilter || undefined,
        min_stipend: minStipend || undefined,
      };

      const data = await listInternships(filters).catch(() => []);
      setItems(data);

      const locations = [...new Set(data.map(i => i.location).filter(Boolean))];
      setAllLocations(locations);

      setLoading(false);
    }

    fetchInternships();
  }, [searchQuery, locationFilter, minStipend]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStipendChange = (e) => {
    const { value } = e.target;
    if (value === "" || value.toLowerCase() === "none" || value.toLowerCase() === "volunteer" || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, stipend: value }));
    }
  };

  const handleEditInternship = (id) => {
    const internshipToEdit = items.find(item => item.id === id);
    if (internshipToEdit) {
      setFormData({
        title: internshipToEdit.title,
        description: internshipToEdit.description,
        location: internshipToEdit.location || "",
        stipend: internshipToEdit.stipend !== null ? internshipToEdit.stipend.toString() : "",
        application_deadline: internshipToEdit.application_deadline ? new Date(internshipToEdit.application_deadline).toISOString().split('T')[0] : "",
        start_date: internshipToEdit.start_date ? new Date(internshipToEdit.start_date).toISOString().split('T')[0] : "",
        end_date: internshipToEdit.end_date ? new Date(internshipToEdit.end_date).toISOString().split('T')[0] : "",
      });
      setIsEditMode(true);
      setCurrentInternshipId(id);
      setShowAddEditModal(true);
    }
  };

  async function handleDelete(id) {
    try {
      await axios.delete(`http://localhost:8000/api/internships/${id}`, { withCredentials: true });
      setItems(items.filter(i => i.id !== id));
      toast.success("Internship deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete internship.");
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location || null,
        stipend: formData.stipend.toLowerCase() === "none" || formData.stipend.toLowerCase() === "volunteer" || formData.stipend === ""
          ? null
          : Number(formData.stipend),
        application_deadline: formData.application_deadline || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };

      let updatedInternship;
      if (isEditMode && currentInternshipId) {
       
        const response = await axios.put(
          `http://localhost:8000/api/internships/${currentInternshipId}`,
          payload,
          { withCredentials: true }
        );
        updatedInternship = response.data;
        setItems(prev =>
          prev.map(item =>
            item.id === currentInternshipId ? { ...item, ...updatedInternship } : item
          )
        );
        toast.success("Internship updated successfully!");
      } else {
        const newOne = await createInternship(payload);
        setItems(prev => [newOne, ...prev]);
        toast.success("Internship posted successfully!");
      }

      setShowAddEditModal(false);
      resetForm();
    } catch (error) {
      console.error("Save/Edit error:", error);
      toast.error("Failed to save internship. Check your backend API for PUT/PATCH support.");
    } finally {
      setSaving(false);
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      stipend: "",
      application_deadline: "",
      start_date: "",
      end_date: "",
    });
    setIsEditMode(false);
    setCurrentInternshipId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />

      <div className="container mx-auto flex-1 px-4 pt-6 pb-10">

        <div className="mb-6">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <h1 className="text-3xl font-bold text-amber-600">Internships</h1>

    <div className="flex flex-col md:flex-row md:items-end gap-4 w-full md:w-auto">

      <input
        type="text"
        placeholder="Search internships..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full md:w-[220px] px-4 py-2 h-10 border rounded-md shadow-sm text-sm focus:ring-amber-500 focus:border-amber-500"
      />

      <select
        value={locationFilter}
        onChange={(e) => setLocationFilter(e.target.value)}
        className="w-full md:w-[220px] px-4 py-2 h-10 border rounded-md shadow-sm text-sm focus:ring-amber-500 focus:border-amber-500"
      >
        <option value="">All locations</option>
        {allLocations.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>

      <select
        value={minStipend}
        onChange={(e) => setMinStipend(e.target.value)}
        className="w-full md:w-[220px] px-4 py-2 h-10 border rounded-md shadow-sm text-sm focus:ring-amber-500 focus:border-amber-500"
      >
        <option value="">All stipends</option>
        <option value="100">100 KM+</option>
        <option value="300">300 KM+</option>
        <option value="500">500 KM+</option>
        <option value="700">700 KM+</option>
        <option value="1000">1000 KM+</option>
      </select>

      {!loading && (me?.role === "employer" || me?.role === "admin") && (
        <button
          onClick={() => {
            resetForm();
            setShowAddEditModal(true);
          }}
          className="h-10 px-6 rounded-md bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 whitespace-nowrap"
        >
          + Add Internship
        </button>
      )}
    </div>
  </div>
</div>


        {loading ? (
          <p className="text-center text-slate-600">Loading…</p>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">No internships available</h3>
              <p className="text-gray-600 mb-6">Sign in or register to access more features and find internship opportunities.</p>
              <Link 
                href="/login" 
                className="inline-flex items-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
              >
                Login or Register
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items
            .filter((i) => {
              const deadline = i.application_deadline ? new Date(i.application_deadline) : null;
              const now = new Date();
              const deadlinePassed = deadline && deadline < now;

             
              return !deadlinePassed && !i.applied;
            })
            .map(i => (
              <InternshipCard
                key={i.id}
                item={i}
                onApply={(id) => setItems((prev) => prev.filter((internship) => internship.id !== id))}
                onSaveToggle={(id, nowSaved) => {
                  
                  setItems(prev => prev.map(internship =>
                    internship.id === id ? { ...internship, saved: nowSaved } : internship
                  ));
                }}
                onDelete={handleDelete}
                onEdit={handleEditInternship}
                setSelectedUser={setSelectedUser}
                setShowProfilePopup={setShowProfilePopup}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
      {showAddEditModal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Internship' : 'Add New Internship'}</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stipend (KM)</label>
                <input
                  type="text"
                  name="stipend"
                  value={formData.stipend}
                  onChange={handleStipendChange}
                  placeholder="Enter amount or 'None' for volunteer position"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
                <input
                  type="date"
                  name="application_deadline"
                  value={formData.application_deadline}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddEditModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-md hover:bg-amber-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : isEditMode ? 'Update Internship' : 'Post Internship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProfilePopup && selectedUser && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
          <div className="relative bg-white rounded-xl p-6 w-full max-w-3xl shadow-xl">
            <button
              onClick={() => {
                setShowProfilePopup(false);
                setSelectedUser(null);
              }}
              className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
            <UserProfileCard
              userId={selectedUser}
              onClose={() => {
                setShowProfilePopup(false);
                setSelectedUser(null);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}