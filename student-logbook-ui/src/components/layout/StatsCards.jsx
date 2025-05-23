import { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance"; // ✅ Your custom axios instance

export default function StatsCards() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axiosInstance.get("/api/log");
        const logs = res.data;

        const total = logs.length;
        const approved = logs.filter((log) => log.status === "approved").length;
        const rejected = logs.filter((log) => log.status === "rejected").length;
        const pending = logs.filter((log) => log.status === "pending").length;

        setStats([
          {
            id: 1,
            label: "Total Entries",
            value: total,
            icon: <FaClipboardList className="text-blue-500" />,
            bgColor: "bg-blue-100",
            textColor: "text-blue-700",
          },
          {
            id: 2,
            label: "Approved Entries",
            value: approved,
            icon: <FaCheckCircle className="text-green-500" />,
            bgColor: "bg-green-100",
            textColor: "text-green-700",
          },
          {
            id: 3,
            label: "Rejected Entries",
            value: rejected,
            icon: <FaTimesCircle className="text-red-500" />,
            bgColor: "bg-red-100",
            textColor: "text-red-700",
          },
          {
            id: 4,
            label: "Pending Entries",
            value: pending,
            icon: <FaHourglassHalf className="text-yellow-500" />,
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-700",
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="overflow-x-hidden px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {stats.map(({ id, label, value, icon, bgColor, textColor }) => (
          <div
            key={id}
            className={`flex items-center gap-4 p-4 rounded-lg shadow ${bgColor} w-full max-w-full overflow-hidden`}
          >
            <div className={`p-3 rounded-full ${textColor} bg-white shrink-0`}>
              {icon}
            </div>
            <div className="truncate">
              <p className="text-2xl font-semibold break-words">{value}</p>
              <p className="text-sm text-gray-600 break-words">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
