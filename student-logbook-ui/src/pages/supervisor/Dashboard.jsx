import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Sidebar from "./Sidebar";
import RecentLogsTable from "./RecentLogs";
import { useAuth } from "../../context/AuthContext";
import { FaUserGraduate, FaClipboardList, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const SupervisorDashboard = () => {
  const [stats, setStats] = useState({
    total_students: 0,
    pending_logs: 0,
    approved_logs: 0,
    rejected_logs: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/supervisor/dashboard-stats");
       
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 md:ml-10 mt-16 bg-gray-100 transition-all">
        <h2 className="text-2xl font-semibold mb-6">Welcome, {user.fullName}</h2>
        <div class="text-center mt-4 mb-6">
          <p class="text-lg font-bold text-green-800">
            West African Postgraduate College of Pharmacists
          </p>
          <p class="text-sm text-gray-600 italic">
            Collège de Troisième Cycle des Pharmaciens de l'Afrique de l'Ouest
          </p>
        </div>


        {/* Stat Cards */}
        {loading ? (
          <p>Loading stats...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard label="Total Students" value={stats.total_students} icon={FaUserGraduate} color="blue"/>
            <StatCard label="Pending Logs" value={stats.pending_logs} icon={FaClipboardList} color="yellow"/>
            <StatCard label="Approved Logs" value={stats.approved_logs} icon={FaCheckCircle} color="green"/>
            <StatCard label="Rejected Logs" value={stats.rejected_logs} icon={FaTimesCircle} color="red"/>
          </div>

        )}

        {/* Recent Logs Table */}
        <div className="dashboard-bg p-6 rounded shadow">
          <h3 className="text-lg font-medium mb-4">Recent Log Submissions</h3>
          <RecentLogsTable />
        </div>
      </main>
    </div>
  );
};



function StatCard({ label, value, icon: Icon, color = '' }) {
  return (
    <div className={`bg-${color}-100 shadow rounded-lg p-6 flex items-center space-x-4`}>
      <div className={`text-${color}-600 text-3xl`}>
        <Icon />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}



export default SupervisorDashboard;
