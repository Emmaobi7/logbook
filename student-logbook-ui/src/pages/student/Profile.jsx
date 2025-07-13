import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FaCamera } from "react-icons/fa";
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from "../../context/AuthContext";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export default function StudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    number: "",
    fullName: user.fullName,
    email: user.email,
    phone: "",
    specialty: "",
    program: "",
    faculty: "",
    country: "",
    residencySite: "",
    residencyPeriod: "",
    preceptorName: "",
  });

  const [passportPreview, setPassportPreview] = useState(null);
  const [passportFile, setPassportFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/student/profile");
        const { passport, ...rest } = res.data;
        setProfile(rest);
       
        if (passport) {
          setPassportPreview(passport);
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePassportUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPassportFile(file);
      setPassportPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(profile).forEach(([key, value]) =>
      formData.append(key, value)
    );
    if (passportFile) {
      formData.append("passport", passportFile);
    }

    try {
      await axiosInstance.post("/student/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Update failed", error);
      alert("Something went wrong");
    }
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="flex flex-col md:flex-row overflow-x-hidden">
      <Sidebar />
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center"></h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center md:items-start md:col-span-1">
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-orange-500 shadow-md hover:shadow-lg transition">
              <img
                src={baseURL + passportPreview || "/placeholder-avatar.png"}
                alt="Passport"
                className="w-full h-full object-cover"
              />
              <label
                htmlFor="passport-upload"
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-900 p-2 rounded-full cursor-pointer transition"
                title="Upload photo"
              >
                <FaCamera className="text-white p-2" />
                <input
                  id="passport-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePassportUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="mt-3 text-sm text-gray-600 text-center md:text-left">
              Upload a clear passport photo
            </p>
          </div>

          {/* Profile Fields */}
          <div className="md:col-span-1 space-y-4">
            <TextInput label="Student Number" name="number" value={profile.number} onChange={handleChange} />
            <TextInput label="Full Name" name="fullName" value={profile.fullName} onChange={handleChange} />
            <TextInput label="Email" name="email" value={user.email} disabled />
            <TextInput label="Phone" name="phone" value={profile.phone} onChange={handleChange} />
            <TextInput label="Specialty" name="specialty" value={profile.specialty} onChange={handleChange} />
            <TextInput label="Program" name="program" value={profile.program} onChange={handleChange} />
            <TextInput label="Faculty" name="faculty" value={profile.faculty} onChange={handleChange} />
            <TextInput label="Country" name="country" value={profile.country} onChange={handleChange} />
            <TextInput label="Residency Site" name="residencySite" value={profile.residencySite} onChange={handleChange} />
            <TextInput label="Residency Period" name="residencyPeriod" value={profile.residencyPeriod} onChange={handleChange} />
            <TextInput label="Precepor Name" name="preceptorName" value={profile.preceptorName} onChange={handleChange} />


          </div>

          <div className="md:col-span-2 mt-6 text-center">
            <button
              type="submit"
              className="btn-primary text-white px-8 py-3 rounded-lg font-medium shadow-md transition"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}

function TextInput({ label, name, value, onChange, disabled }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium text-gray-700">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="bg-white border border-gray-300 rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
