import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import axiosInstance from '../../utils/axiosInstance';
import { FiInbox } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';


export default function Logbook() {
  const [logs, setLogs] = useState([]);
  const [newEntry, setNewEntry] = useState({ description: '', title: '' });
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLogs() {
      setLoadingLogs(true);
      setError('');
      try {
        const res = await axiosInstance.get('/api/log');
        if (Array.isArray(res.data)) {
          setLogs(res.data);
        } else {
          setError('Invalid response format from server.');
        }
      } catch (err) {
        // If payment middleware blocks access (403 or 402)
        if (err.response && (err.response.status === 403 || err.response.status === 402)) {
          navigate('/payment-required');
        } else {
          setError('Failed to fetch logs.');
        }
      }
      setLoadingLogs(false);
    }
    fetchLogs();
  }, []);

  const handleChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!newEntry.description.trim() || !newEntry.title.trim()) {
      return alert('Missing Fields!');
    }

    try {
      setSubmitting(true);
      const res = await axiosInstance.post('/api/log', newEntry);
      setLogs([res.data, ...logs]);
      setNewEntry({ description: '', title: '' });
    } catch (err) {
        if (err.response && err.response.status === 409) {
          // Specific handling for "already submitted"
          setError('You have already submitted a log for today.');
        } else {
          setError('Error adding new log entry.');
          console.error('Add log error:', err);
        }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 mt-16">
        <h1 className="text-3xl font-semibold mb-6">My Logbook</h1>

        <form
          onSubmit={handleSubmit}
          className="mb-10 bg-white p-6 rounded-lg shadow-md max-w-xl"
        >
          <div className="mb-4">
            <label htmlFor="title" className='block mb-1 font-medium'>
              Title
            </label>
            <input type="text"
              id='title'
              name='title'
              value={newEntry.title}
              onChange={handleChange}
              placeholder='Enter a title'
              className='w-full border border-grey-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
              disabled={submitting}
            />
            <label htmlFor="description" className="block mb-1 font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={newEntry.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your activity..."
              required
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            className={`px-6 py-2 rounded text-white ${
              submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Add Entry'}
          </button>
          {error && <p className="text-red-600 mt-3">{error}</p>}
        </form>

        <section>
          {loadingLogs ? (
            <p>Loading logs...</p>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center text-gray-500 mt-20">
              <FiInbox size={48} />
              <p className="mt-4 text-lg">No log entries found. Start by adding a new entry above.</p>
            </div>
          ) : (
            <ul className="space-y-4 max-w-3xl">
              {logs.map((log) => (
                <li
                  key={log._id || log.id}
                  className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">
                        {new Date(log.date).toLocaleDateString()}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap">{log.title}</p>
                    </div>
                    <div className="text-sm text-gray-500 italic capitalize">
                      {log.status || 'Pending'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
