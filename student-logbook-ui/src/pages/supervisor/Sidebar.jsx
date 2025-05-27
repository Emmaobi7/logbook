// components/Sidebar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaRegQuestionCircle, FaUsers, FaBars, FaTimes, FaUserGraduate, FaClipboardList, FaFileExport, FaHome, FaSignOutAlt, FaUser, FaBell } from "react-icons/fa";
import { MdAssignment } from 'react-icons/md';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  // Close sidebar when navigating
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const links = user?.role === "supervisor"
    ? [
        { name: "Dashboard", to: "/supervisor/dashboard", icon: <FaHome /> },
        { name: "Student Logs", to: "/supervisor/logs", icon: <FaClipboardList /> },
        { name: "My Students", to: "/supervisor/students", icon: <FaUsers  /> },
        { name: "Export Logs", to: "/supervisor/export", icon: <FaFileExport /> },
        { name: "Profile", to: "/supervisor/profile", icon: <FaUser /> },
        { name: "Notification", to: "/supervisor/notification", icon: <FaBell  /> },
        { name: "Guide", to: "/supervisor/guide", icon: <FaRegQuestionCircle  /> },
        
      ]
    : [
        { name: "Dashboard", to: "/student/dashboard", icon: <FaHome /> },
        { name: "My Logs", to: "/student/logs", icon: <FaClipboardList /> },
        { name: "Create Log", to: "/student/create", icon: <FaFileExport /> },
        
      ];

  return (
    <>
      {/* Mobile Top Bar - Only shows on mobile */}
      {isMobile && (
        <div className="md:hidden bg-blue-800 p-4 flex justify-between items-center text-white fixed top-0 left-0 right-0 z-50">
          <h1 className="text-lg font-bold">LOGBOOK</h1>
          <button onClick={() => setOpen(!open)}>
            {open ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-900 text-white z-40 p-4 transition-transform duration-300 ease-in-out
        ${open || !isMobile ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative`}
      >
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-700 transition ${
                location.pathname === link.to ? 'bg-blue-700' : ''
              }`}
              onClick={() => isMobile && setOpen(false)}
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
              
            </Link>
          ))}
          <button
                  className="flex items-center gap-3 px-4 py-2 mt-4 text-red-600 hover:bg-red-100 rounded-lg"
                  onClick={() => handleLogout()}
                >
                  <FaSignOutAlt />
                  Logout
                </button>
        </nav>
      </div>

      {/* Mobile Overlay - Only shows when sidebar is open on mobile */}
      {open && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}