import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdDashboard, MdSettings, MdPeople, MdAssignment } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();

  // Close sidebar when clicking outside or changing route
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    // Close when route changes
    setOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location]);

  // Close on escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-blue-900 text-white"
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
      >
        {open ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-blue-900 text-white w-64 p-6 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-50`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <button
              className="md:hidden text-white"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-2">
            <NavItem to="/admin/dashboard" icon={<MdDashboard />} text="Dashboard" />
            <NavItem to="/users" icon={<MdPeople />} text="Users" />
            <NavItem to="/reports" icon={<MdAssignment />} text="Reports" />
            <NavItem to="/settings" icon={<MdSettings />} text="Settings" />
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-blue-800">
            <p className="text-sm text-blue-300">v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}

// Custom NavItem component for active states
function NavItem({ to, icon, text }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 p-3 rounded-md transition-colors ${
          isActive
            ? "bg-blue-800 text-white"
            : "text-blue-200 hover:bg-blue-800 hover:text-white"
        }`
      }
    >
      <span className="text-xl">{icon}</span>
      <span>{text}</span>
    </NavLink>
  );
}