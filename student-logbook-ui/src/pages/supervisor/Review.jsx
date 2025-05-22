import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SupervisorReviewPage = () => {
  const { token } = useParams();
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [updatingLogId, setUpdatingLogId] = useState(null);
  const [comments, setComments] = useState({}); // store comments per log entry

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/supervisor/session/${token}`);
        setSession(res.data);
      } catch (err) {
        setError('Invalid or expired session link.');
      }
    };

    fetchSession();
  }, [token]);

  const handleStatusUpdate = async (logId, status) => {
    setLoading(true);
    setUpdatingLogId(logId);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/supervisor/log/${logId}/update`, {
        status,
        comment: comments[logId] || '',
        token,
      });

      // Update local session state to reflect the change immediately
      setSession((prev) => ({
        ...prev,
        logEntries: prev.logEntries.map((entry) =>
          entry._id === logId ? { ...entry, status, comments: comments[logId] || entry.comments } : entry
        ),
      }));

      alert(`Log entry ${status}.`);
    } catch (err) {
      alert('Failed to update log entry status.');
      console.error(err);
    } finally {
      setLoading(false);
      setUpdatingLogId(null);
    }
  };

  if (error) return <div className="text-red-600 text-center mt-10">{error}</div>;
  if (!session) return <div className="text-center mt-10">Loading session...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-900 text-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold mb-6 border-b border-gray-700 pb-3">
        Logbook Review
      </h1>
      <div className="mb-8 space-y-1">
        <p><span className="font-semibold">Supervisor:</span> {session.supervisorName}</p>
        <p><span className="font-semibold">Student:</span> {session.student.name} ({session.student.email})</p>
      </div>

      <div>
        {session.logEntries.length === 0 ? (
          <p className="text-gray-400">No log entries available.</p>
        ) : (
          session.logEntries.map((entry) => (
            <div key={entry._id} className="mb-6 p-5 bg-gray-800 rounded-lg border border-gray-700 shadow-md">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-lg">{new Date(entry.date).toLocaleDateString()}</p>
                <p
                  className={`capitalize font-semibold px-3 py-1 rounded ${
                    entry.status === 'approved'
                      ? 'bg-green-600 text-green-100'
                      : entry.status === 'rejected'
                      ? 'bg-red-600 text-red-100'
                      : 'bg-yellow-600 text-yellow-100'
                  }`}
                >
                  {entry.status}
                </p>
              </div>

              <p className="mb-2"><span className="font-semibold">Activities:</span> {entry.content}</p>
              <p className="mb-4"><span className="font-semibold">Comments:</span> {entry.comments || '—'}</p>

              {entry.status === 'pending' && (
                <>
                  {/* <textarea
                    placeholder="Add a comment (optional)"
                    value={comments[entry._id] || ''}
                    onChange={(e) =>
                      setComments((prev) => ({ ...prev, [entry._id]: e.target.value }))
                    }
                    className="w-full mb-3 p-2 rounded bg-gray-700 text-gray-200 resize-none"
                    rows={3}
                  /> */}
                  <div className="flex space-x-4">
                    <button
                      disabled={loading && updatingLogId === entry._id}
                      onClick={() => handleStatusUpdate(entry._id, 'approved')}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold transition disabled:opacity-50"
                    >
                      {loading && updatingLogId === entry._id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      disabled={loading && updatingLogId === entry._id}
                      onClick={() => handleStatusUpdate(entry._id, 'rejected')}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition disabled:opacity-50"
                    >
                      {loading && updatingLogId === entry._id ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SupervisorReviewPage;
