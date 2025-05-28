import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Sidebar from "./Sidebar";

const statuses = ["pending", "approved", "rejected"];

const StudentLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (statusFilter) => {
    try {
      setLoading(true);
      const query = statusFilter && statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const res = await axiosInstance.get(`/supervisor/student-logs${query}`);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(filterStatus);
  }, [filterStatus]);

  const handleStatusChange = async (logId, newStatus, comment) => {
    try {
      await axiosInstance.patch(`/supervisor/student-logs/${logId}`, {
        status: newStatus,
        supervisorComment: comment,
      });
      // Refresh logs or optimistically update state
      fetchLogs(filterStatus);
    } catch (err) {
      alert("Failed to update log status");
    }
  };

  return (
    <div className="flex min-h-screen">
        <Sidebar />
    <div className="p-6">
      <h2 className="text-2xl mb-4 font-semibold">Student Logs</h2>

      <div className="mb-4">
        <label className="mr-2">Filter by status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded p-1"
        >
          <option value="all">All</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <LogsTable logs={logs} onStatusChange={handleStatusChange} />
      )}
    </div>
    </div>
  );
};



const LogsTable = ({ logs, onStatusChange }) => {
  return (
    <table className="w-full table-auto border-collapse">
      {/* <thead>
        <tr className="bg-gray-200">
          <th className="p-2">Student</th>
          <th className="p-2">Date</th>
          <th className="p-2">Description</th>
          <th className="p-2">Status</th>
          <th className="p-2">Supervisor Comment</th>
          <th className="p-2">Action</th>
        </tr>
      </thead> */}
      <tbody>
        {logs.map((log) => (
          <LogRow key={log._id} log={log} onStatusChange={onStatusChange} />
        ))}
      </tbody>
    </table>
  );
};



const LogRow = ({ log, onStatusChange }) => {
    
  const [status, setStatus] = useState(log.status);
  const [comment, setComment] = useState(log.comments || "");
  const [editing, setEditing] = useState(false);

  const canEdit = log.status === "pending";

  const handleSave = () => {
    onStatusChange(log._id, status, comment);
    setEditing(false);
  };

  return (
    <>
      {/* Basic Info Row */}
      <tr className="border-b bg-white">
        <td className="p-3 font-medium">{log.user.fullName}</td>
        <td className="p-3 text-sm text-gray-700">
          {new Date(log.date).toLocaleDateString()}
        </td>
        <td className="p-3 text-sm capitalize">
          {canEdit ? (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          ) : (
            <span
              className={`font-semibold ${
                status === "approved"
                  ? "text-green-600"
                  : status === "rejected"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {status}
            </span>
          )}
        </td>
        {/* <td className="p-3 text-right">
          {canEdit && (
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Save
            </button>
          )}
        </td> */}
      </tr>

      {/* Competencies Row */}
      <tr className="bg-gray-50">
        <td colSpan={4} className="p-3">
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Activity:</span>
            <p className="mt-1 whitespace-pre-wrap">{log.title}</p>
          </div>
        </td>
      </tr>

      {/* Activity Row */}
      <tr className="bg-gray-50">
        <td colSpan={4} className="p-3">
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Competencies Aquired:</span>
            <p className="mt-1 whitespace-pre-wrap">{log.content}</p>
          </div>
        </td>
      </tr>

      {/* Comment Row */}
      <tr className="bg-gray-50 border-b">
        <td colSpan={4} className="p-3">
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Preceptors Comment:</span>
            {canEdit ? (
              <textarea
                value={comment}
                rows={3}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border p-2 mt-1 rounded resize-none"
                placeholder="Write your comment here..."
              />
            ) : (
              <p className="mt-1 whitespace-pre-wrap">
                {comment || <em className="text-gray-500">No comment</em>}
              </p>
            )}
          </div>
          <td className="p-3 text-right">
          {canEdit && (
            <button
              onClick={handleSave}
              className="btn-primary text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Save
            </button>
          )}
        </td>
        </td>
      </tr>
    </>
  );
};


export default StudentLogsPage;
