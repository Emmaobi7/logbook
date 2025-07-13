import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaUserTie,
  FaBell,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUser,
  FaBars,
  FaTimes,
  FaRegQuestionCircle,
} from 'react-icons/fa';
import { MdAssignment } from 'react-icons/md';
import logo from '../../assets/wps2.png';

const links = [
  { to: '/student/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
  { to: '/student/logbook', label: 'My Logbook', icon: <FaBook /> },
  { to: '/student/scores', label: 'Scores', icon: <MdAssignment /> },
  { to: '/student/preceptor', label: 'Preceptor', icon: <FaUserTie /> },
  // { to: '/student/exam-registration', label: 'Exam Registration', icon: <FaBook /> },
  { to: '/student/profile', label: 'Profile', icon: <FaUser /> },
  { to: '/student/notification', label: 'Notification', icon: <FaBell /> },
  { to: '/student/guide', label: 'Guide', icon: < FaRegQuestionCircle /> },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
  { to: '/admin/users', label: 'Users', icon: <FaUser /> },
  { to: '/admin/scores', label: 'Scores', icon: <MdAssignment /> },
  { to: '/admin/notification', label: 'Notification', icon: <FaBell /> },
  { to: '/admin/sent', label: 'Sent', icon: <FaBook /> },
  { to: '/admin/assign', label: 'Assign', icon: <FaUserTie /> },
  { to: '/admin/guide', label: 'Guide', icon: <FaRegQuestionCircle /> },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md sidebar-student text-white"
        onClick={() => setIsOpen(true)}
        aria-label="Open sidebar"
      >
        <FaBars />
      </button>

      {/* Overlay when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 sidebar-student shadow-md px-4 py-6
          transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:flex md:flex-col
        `}
      >
        {/* Close button for mobile */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-xl font-bold text-blue-700">Student Logbook</h2>
          <button onClick={() => setIsOpen(false)} aria-label="Close sidebar">
            <FaTimes />
          </button>
        </div>

        {/* Sidebar content */}
        <nav className="flex flex-col gap-2">
          <div className='sidebar-logo'>
                 <img src={logo} alt="Logo" className="mx-auto w-full h-auto mb-2" />
          </div>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)} // close sidebar on link click (mobile)
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-blue-50'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
          <button
            className="flex items-center gap-3 px-4 py-2 mt-4 btn-logout-student rounded-lg"
            onClick={() => handleLogout()}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
