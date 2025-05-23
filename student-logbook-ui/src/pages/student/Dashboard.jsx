import Sidebar from '../../components/layout/Sidebar';
import StatsCards from '../../components/layout/StatsCards';
import CalendarView from '../../components/layout/CalendarView';
import { useAuth } from "../../context/AuthContext";

export default function StudentDashboard() {
   const { user } = useAuth();

  return (
    <div className="flex flex-col md:flex-row overflow-x-hidden">
  <Sidebar />
  <div className="flex-1 px-4 md:p-15 p-15">
    <h1 className="text-2xl font-semibold mb-4">Welcome, Mr {user.fullName}</h1>
    <p className="text-gray-600 mb-6">This is your dashboard overview.</p>

    <StatsCards />
    {/* <CalendarView /> */}
  </div>
</div>

  );
}
