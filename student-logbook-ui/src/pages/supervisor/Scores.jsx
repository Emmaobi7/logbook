import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';

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

export default function SupervisorScores() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingScores, setLoadingScores] = useState(true);
  const [errorStudents, setErrorStudents] = useState('');
  const [errorScores, setErrorScores] = useState('');
  const [activeStudent, setActiveStudent] = useState(null);


  // Fetch assigned students
  useEffect(() => {
    async function fetchStudents() {
      setLoadingStudents(true);
      setErrorStudents('');
      try {
        const res = await axiosInstance.get(`/supervisor/students`);
        setStudents(res.data.students || []);
      } catch (err) {
        console.log(err)
        setErrorStudents('Failed to fetch students.');
      } finally {
        setLoadingStudents(false);
      }
    }
    fetchStudents();
  }, []);

  // Fetch scores given by supervisor
  useEffect(() => {
    async function fetchScores() {
      setLoadingScores(true);
      setErrorScores('');
      try {
        const res = await axiosInstance.get(`/api/scores/supervisor/${user.id}`);
        console.log(res.data.scores)
        setScores(res.data.scores || []);
      } catch (err) {
        console.log(err)
        setErrorScores('Failed to fetch scores.');
      } finally {
        setLoadingScores(false);
      }
    }
    fetchScores();
  }, [user.id]);

  // Refresh scores after submitting
  const refreshScores = async () => {
    setLoadingScores(true);
    setErrorScores('');
    try {
      const res = await axiosInstance.get(`/api/scores/supervisor/${user.id}`);
      setScores(res.data.scores || []);
    } catch (err) {
      setErrorScores('Failed to fetch scores.');
    } finally {
      setLoadingScores(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 mt-16">
        <h1 className="text-2xl font-semibold mb-6">Scores</h1>

        {/* Assigned Students Table */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Assigned Students</h2>
          {loadingStudents ? (
            <p>Loading students...</p>
          ) : errorStudents ? (
            <p className="text-red-600">{errorStudents}</p>
          ) : students.length === 0 ? (
            <p className="text-gray-600">No students assigned.</p>
          ) : (
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white border rounded shadow text-sm">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="py-2 px-4 border">Name</th>
                    <th className="py-2 px-4 border">Email</th>
                    <th className="py-2 px-4 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.studentId} className="border-t">
                      <td className="py-2 px-4 border">{student.fullName}</td>
                      <td className="py-2 px-4 border">{student.email}</td>
                      <td className="py-2 px-4 border">
                        <button
                          className="btn-secondary text-white px-3 py-1 rounded hover:bg-blue-700"
                          onClick={() => setActiveStudent(student)}
                        >
                          Score Student
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeStudent && (
            <ScoreModal
              student={activeStudent}
              onClose={() => setActiveStudent(null)}
              onScored={refreshScores}
            />
          )}
        </section>

        {/* Scores Table */}
        <section>
          <h2 className="text-xl font-bold mb-4">Scores Given</h2>
          {loadingScores ? (
            <p>Loading scores...</p>
          ) : errorScores ? (
            <p className="text-red-600">{errorScores}</p>
          ) : scores.length === 0 ? (
            <p className="text-gray-600">No scores submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              {!loadingScores && !errorScores && scores.length > 0 && (
                <button
                  onClick={() => exportSupervisorScoresToCSV(scores, criteria)}
                  className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Export Scores to CSV
                </button>
              )}

              <table className="min-w-full bg-white border rounded shadow text-sm">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="py-2 px-4 border">Date</th>
                    <th className="py-2 px-4 border">Student</th>
                    <th className="py-2 px-4 border">Student Email</th>
                    {criteria.map(c => (
                      <th key={c.key} className="py-2 px-4 border">{c.label}</th>
                    ))}
                    <th className="py-2 px-4 border">Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map(score => (
                    <tr key={score._id} className="border-t">
                      <td className="py-2 px-4 border">{new Date(score.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border">{score.student?.fullName || '-'}</td>
                      <td className="py-2 px-4 border">{score.student?.email || '-'}</td>
                      {criteria.map(c => (
                        <td key={c.key} className="py-2 px-4 border text-center">{score[c.key]}</td>
                      ))}
                      <td className="py-2 px-4 border">{score.comment || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function ScoreModal({ student, onClose, onScored }) {
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
        const res = await axiosInstance.get(`/api/scores/student/${student.studentId}`);
        const scores = res.data.scores || [];
        if (scores.length > 0) {
          const last = new Date(scores[0].createdAt);
          setLastScoreDate(last);
          const now = new Date();
          const diff = (now - last) / (1000 * 60 * 60 * 24);
          if (diff < 7) setCanScore(false);
        }
      } catch (err) {
        // ignore
      }
    }
    checkLastScore();
  }, [student.studentId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axiosInstance.post(`/api/scores/${student.studentId}`, { ...form, comment });
      setSuccess("Score submitted successfully!");
      setCanScore(false);
      if (onScored) onScored();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit score.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[10px] bg-opacity-40 flex items-center overflow-auto justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-30 relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Score {student.fullName}</h2>
        {lastScoreDate && (
          <p className="mb-2 text-sm text-gray-600">Last scored: {lastScoreDate.toLocaleDateString()}</p>
        )}
        {!canScore ? (
          <div className="text-red-600 mb-4">This student has already been scored in the last 7 days.</div>
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
              className="btn-secondary text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Score'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 





function exportSupervisorScoresToCSV(scores, criteria, filename = 'scores_given.csv') {
  if (!scores || scores.length === 0) return;

  const headers = [
    'Date',
    'Student Name',
    'Student Email',
    ...criteria.map(c => c.label),
    'Comment',
  ];

  const rows = scores.map(score => [
    new Date(score.createdAt).toLocaleDateString(),
    score.student?.fullName || '-',
    score.student?.email || '-',
    ...criteria.map(c => score[c.key]),
    score.comment || '-',
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(value => `"${value}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
