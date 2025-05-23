import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Sidebar from "./Sidebar";
import RecentLogsTable from "./RecentLogs";

const SupervisorDashboard = () => {
  const [stats, setStats] = useState({
    total_students: 0,
    pending_logs: 0,
    approved_logs: 0,
  });
  const [loading, setLoading] = useState(true);

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

      <main className="flex-1 p-4 md:ml-64 bg-gray-100 transition-all">
        <h2 className="text-2xl font-semibold mb-6">Welcome, Supervisor</h2>

        {/* Stat Cards */}
        {loading ? (
          <p>Loading stats...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard label="Total Students" value={stats.total_students} />
            <StatCard label="Pending Logs" value={stats.pending_logs} />
            <StatCard label="Approved Logs" value={stats.approved_logs} />
          </div>
        )}

        {/* Recent Logs Table */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-medium mb-4">Recent Log Submissions</h3>
          <RecentLogsTable />
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <h4 className="text-gray-600">{label}</h4>
    <p className="text-2xl font-bold text-blue-700">{value}</p>
  </div>
);

export default SupervisorDashboard;
