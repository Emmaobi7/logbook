import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
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

export default function StudentScores() {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    
    async function fetchScores() {
      console.log(user)
      setLoading(true);
      setError('');
      try {
        const res = await axiosInstance.get(`/api/scores/student/${user.id}`);
        setScores(res.data.scores || []);
      } catch (err) {
        console.log(err)
        setError('Failed to fetch scores.');
      } finally {
        setLoading(false);
      }
    }
    fetchScores();
  }, [user.id]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 mt-16">
        <h1 className="text-2xl font-semibold mb-6">My Scores</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : scores.length === 0 ? (
          <p className="text-gray-600">No scores available yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded shadow text-sm">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="py-2 px-4 border">Date</th>
                  {criteria.map(c => (
                    <th key={c.key} className="py-2 px-4 border">{c.label}</th>
                  ))}
                  <th className="py-2 px-4 border">Supervisor</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Comment</th>
                </tr>
              </thead>
              <tbody>
                {scores.map(score => (
                  <tr key={score._id} className="border-t">
                    <td className="py-2 px-4 border">{new Date(score.createdAt).toLocaleDateString()}</td>
                    {criteria.map(c => (
                      <td key={c.key} className="py-2 px-4 border text-center">{score[c.key]}</td>
                    ))}
                    <td className="py-2 px-4 border">{score.supervisorName}</td>
                    <td className="py-2 px-4 border">{score.supervisorEmail}</td>
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