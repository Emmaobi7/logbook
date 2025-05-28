import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const RecentLogsTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axiosInstance.get("/supervisor/recent-logs");
        setLogs(res.data);
      } catch (error) {
        console.error("Failed to load logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <p>Loading logs...</p>;

  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="bg-orange-200 text-left">
          <th className="p-2">Student</th>
          <th className="p-2">Date</th>
          <th className="p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log, index) => (
          <tr key={index} className="border-b hover:bg-gray-100">
            <td className="p-2">{log.student}</td>
            <td className="p-2">{log.date}</td>
            <td className="p-2 capitalize text-blue-700">{log.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RecentLogsTable;
