import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import StatsCards from '../../components/layout/StatsCards';
import { useAuth } from "../../context/AuthContext";
import axiosInstance from '../../utils/axiosInstance';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [supervisor, setSupervisor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSupervisor() {
      try {
        const res = await axiosInstance.get('/student/get-supervisor');
        setSupervisor(res.data.supervisor);
      } catch (error) {
        console.error('Failed to fetch supervisor:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSupervisor();
  }, []);

  return (
    <div className="flex flex-col md:flex-row overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 px-4 md:p-15 p-15">
        <h1 className="text-2xl font-semibold mb-4">Welcome, {user.fullName}</h1>
        <div class="text-center mt-4 mb-6">
          <p class="text-lg font-bold text-green-800">
            West African Postgraduate College of Pharmacists
          </p>
          <p class="text-sm text-gray-600 italic">
            Collège de Troisième Cycle des Pharmaciens de l'Afrique de l'Ouest
          </p>
        </div>

        <p className="text-gray-600 mb-6">This is your dashboard overview.</p>

        {!loading && (
          supervisor ? (
            <div className="mb-6 p-4 bg-blue-100 text-blue-900 rounded">
              You are currently supervised by <strong>{supervisor.fullName}</strong> ({supervisor.email})
            </div>
          ) : (
            <div className="mb-6 p-4 bg-yellow-100 text-yellow-900 rounded">
              You currently have no supervisor assigned.
            </div>
          )
        )}

        <StatsCards />
        {/* <CalendarView /> */}
      </div>
    </div>
  );
}
