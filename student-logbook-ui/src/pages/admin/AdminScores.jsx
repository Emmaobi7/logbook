import React, { useEffect, useState } from 'react';
import Sidebar from './SideBar';
import axiosInstance from '../../utils/axiosInstance';

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

export default function AdminScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchScores() {
      setLoading(true);
      setError('');
      try {
        const res = await axiosInstance.get('/api/scores');
        console.log(res)
        setScores(res.data.scores || []);
      } catch (err) {
        console.log(err)
        setError('Failed to fetch scores.');
      } finally {
        setLoading(false);
      }
    }
    fetchScores();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 mt-16 ml-65">
        <h1 className="text-2xl font-semibold mb-6">All Student Scores</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : scores.length === 0 ? (
          <p className="text-gray-600">No scores available yet.</p>
        ) : (
          <div className="overflow-x-auto">
            {!loading && !error && scores.length > 0 && (
              <button
                onClick={() => exportAdminScoresToCSV(scores, criteria)}
                className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Export All Scores to CSV
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
                  <th className="py-2 px-4 border">Preceptor</th>
                  <th className="py-2 px-4 border">Preceptor's Email</th>
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
                    <td className="py-2 px-4 border">{score.supervisor?.fullName || score.supervisorName}</td>
                    <td className="py-2 px-4 border">{score.supervisor?.email || score.supervisorEmail}</td>
                    <td className="py-2 px-4 border">{score.comment || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
} 




function exportAdminScoresToCSV(scores, criteria, filename = 'all_student_scores.csv') {
  if (!scores || scores.length === 0) return;

  const headers = [
    'Date',
    'Student Name',
    'Student Email',
    ...criteria.map(c => c.label),
    'Preceptor',
    'Preceptor Email',
    'Comment',
  ];

  const rows = scores.map(score => [
    new Date(score.createdAt).toLocaleDateString(),
    score.student?.fullName || '-',
    score.student?.email || '-',
    ...criteria.map(c => score[c.key]),
    score.supervisor?.fullName || score.supervisorName || '-',
    score.supervisor?.email || score.supervisorEmail || '-',
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
