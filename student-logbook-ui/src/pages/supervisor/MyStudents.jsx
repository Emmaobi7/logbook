import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Sidebar from "./Sidebar";

const statuses = ["pending", "approved", "rejected"];

const criteria = [
  { key: 'punctuality', label: 'Punctuality' },
  { key: 'abilityToWorkUnsupervised', label: 'Ability to Work Unsupervised' },
  { key: 'teamPlaying', label: 'Team Playing' },
  { key: 'initiative', label: 'Initiative' },
  { key: 'interpersonalRelationship', label: 'Interpersonal Relationship' },
  { key: 'attitudeToWork', label: 'Attitude to Work' },
  { key: 'senseOfResponsibility', label: 'Sense of Responsibility' },
  { key: 'appearance', label: 'Appearance' },
  { key: 'leadershipAbilities', label: 'Leadership Abilities' },
  { key: 'problemSolvingAbilities', label: 'Problem-Solving Abilities' },
];

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

const StudentRow = ({ student }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <tr>
      <td>{student.fullName}</td>
      <td>{student.email}</td>
      <td>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          Score Student
        </button>
        {showModal && (
          <ScoreModal student={student} onClose={() => setShowModal(false)} />
        )}
      </td>
    </tr>
  );
};

const ScoreModal = ({ student, onClose }) => {
  const [form, setForm] = useState(() => Object.fromEntries(criteria.map(c => [c.key, 3])));
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [canScore, setCanScore] = useState(true);
  const [lastScoreDate, setLastScoreDate] = useState(null);

  useEffect(() => {
    async function checkLastScore() {
      try {
        const res = await axiosInstance.get(`/api/scores/student/${student._id}`);
        const scores = res.data.scores || [];
        if (scores.length > 0) {
          const last = new Date(scores[0].createdAt);
          setLastScoreDate(last);
          const now = new Date();
          const diff = (now - last) / (1000 * 60 * 60 * 24);
          if (diff < 28) setCanScore(false);
        }
      } catch (err) {
        // ignore
      }
    }
    checkLastScore();
  }, [student._id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axiosInstance.post(`/api/scores/${student._id}`, { ...form, comment });
      setSuccess("Score submitted successfully!");
      setCanScore(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit score.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Score {student.fullName}</h2>
        {lastScoreDate && (
          <p className="mb-2 text-sm text-gray-600">Last scored: {lastScoreDate.toLocaleDateString()}</p>
        )}
        {!canScore ? (
          <div className="text-red-600 mb-4">This student has already been scored in the last 28 days.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {criteria.map(c => (
              <div key={c.key} className="flex items-center justify-between">
                <label className="font-medium">{c.label}</label>
                <select
                  name={c.key}
                  value={form[c.key]}
                  onChange={handleChange}
                  className="border rounded px-2 py-1"
                  required
                >
                  {[5,4,3,2,1].map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
            ))}
            <div>
              <label className="font-medium">Comment (optional)</label>
              <textarea
                className="w-full border rounded p-2"
                rows={2}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Add a comment..."
              />
            </div>
            {error && <div className="text-red-600">{error}</div>}
            {success && <div className="text-green-600">{success}</div>}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Score'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentLogsPage;
