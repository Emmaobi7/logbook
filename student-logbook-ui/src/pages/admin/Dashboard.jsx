import { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import StatCard from "./statCard";
import { FaUser, FaUserTie, FaUserGraduate } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    supervisors: 0,
    students: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main className="flex-1 p-6 mt-10 md:ml-64">
        <h2 className="text-2xl font-semibold mb-6">Welcome, {user.fullName}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={FaUser} label="Total Users" value={stats.users} />
          <StatCard icon={FaUserTie} label="Preceptors" value={stats.supervisors} />
          <StatCard icon={FaUserGraduate} label="Students" value={stats.students} />
        </div>
      </main>
    </div>
  );
}
