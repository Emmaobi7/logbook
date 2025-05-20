// src/pages/student/Logbook.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import axios from 'axios';

export default function Logbook() {
  const [logs, setLogs] = useState([
    { id: 1, date: '2025-05-20', description: 'Worked on project X' },
    { id: 2, date: '2025-05-19', description: 'Attended seminar' },
  ]);
  const [newEntry, setNewEntry] = useState({ date: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch logs from API on component mount
  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('/api/logs'); // Adjust API endpoint as needed
        if (Array.isArray(res.data)) {
          setLogs(res.data);
        } else {
          setError('Invalid response format from server.');
        }
      } catch (err) {
        setError('Failed to fetch logs.');
        console.error('Fetch logs error:', err);
      }
      setLoading(false);
    }
    fetchLogs();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  // Handle form submit to add new log entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newEntry.date || !newEntry.description) {
      return alert('Please fill in all fields.');
    }

    try {
      setLoading(true);
      const res = await axios.post('/api/logs', newEntry);
      // Add new log to the top of the list
      setLogs([res.data, ...logs]);
      setNewEntry({ date: '', description: '' });
    } catch (err) {
      setError('Error adding new log entry.');
      console.error('Add log error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-semibold mb-6">My Logbook</h1>

        {/* New Entry Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-10 bg-white p-6 rounded-lg shadow-md max-w-xl"
        >
          <div className="mb-4">
            <label htmlFor="date" className="block mb-1 font-medium">
              Date
            </label>
            <input
              id="date"
              type="date"
              name="date"
              value={newEntry.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
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
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`px-6 py-2 rounded text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Add Entry'}
          </button>
          {error && <p className="text-red-600 mt-3">{error}</p>}
        </form>

        {/* Log Entries */}
        <section>
          {loading && logs.length === 0 ? (
            <p>Loading logs...</p>
          ) : error && logs.length === 0 ? (
            <p className="text-red-600">{error}</p>
          ) : logs.length === 0 ? (
            <p>No log entries found. Start by adding a new entry above.</p>
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
                      <p className="mt-1 whitespace-pre-wrap">{log.description}</p>
                    </div>
                    <div className="text-sm text-gray-500 italic">
                      {log.status ? log.status : 'Pending'}
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
