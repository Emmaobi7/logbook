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
        <div class="text-center mt-4 mb-6">
          <p class="text-lg font-bold text-green-800">
            West African Postgraduate College of Pharmacists
          </p>
          <p class="text-sm text-gray-600 italic">
            Collège de Troisième Cycle des Pharmaciens de l'Afrique de l'Ouest
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={FaUser} label="Total Users" value={stats.users} color="orange"/>
          <StatCard icon={FaUserTie} label="Preceptors" value={stats.supervisors} color="blue"/>
          <StatCard icon={FaUserGraduate} label="Students" value={stats.students} color="green"/>
        </div>
      </main>
    </div>
  );
}
