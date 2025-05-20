import Sidebar from '../../components/layout/Sidebar';
import StatsCards from '../../components/layout/StatsCards';
import CalendarView from '../../components/layout/CalendarView';

export default function StudentDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-15">
        <h1 className="text-2xl font-semibold mb-4">Welcome, Student</h1>
        <p className="text-gray-600 mb-6">This is your dashboard overview.</p>

        <StatsCards />

        <CalendarView />
      </div>
    </div>
  );
}
