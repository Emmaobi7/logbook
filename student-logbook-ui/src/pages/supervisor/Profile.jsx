import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance"; 
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function SupervisorProfile() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    fullName: user.fullName,
    email: "",
    country: "",
    phone: "",
    specialty: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/supervisor-profile/profile");
        setForm(data);
      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put("/supervisor-profile/profile", form);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen">
        <Sidebar />
    <div className="w-full mx-5  text-black rounded-xl shadow p-8 mt-10">
      <h2 className="text-2xl font-semibold text-black mb-6">
        Preceptor's Profile
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-black  mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-black-600 dark:text-black-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              disabled
              value={user.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-black mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-black  mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-black mb-1">Specialty</label>
            <input
              type="text"
              name="specialty"
              value={form.specialty}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-secondary hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition"
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>
      )}
    </div>
    </div>
  );
}
