// src/components/UsersList.jsx
import React, { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { FaUserEdit, FaTrash, FaEye, FaToggleOn, FaToggleOff, FaBell } from 'react-icons/fa';
import { Button, Select, MenuItem, TextField, CircularProgress, Tooltip } from '@mui/material';
import UserDetailsModal from './UserDetailsModal';
import ConfirmDialog from './Confirmdialog';
import { useNavigate } from 'react-router-dom'; // for navigating to notifications page

const UsersList = () => {
  const navigate = useNavigate();

  // Filters state
  const [filters, setFilters] = useState({
    role: '',
    isActive: '',
    hasPaid: '',
    search: '',
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({ action: '', user: null });

  // Fetch users with filters
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.role) params.role = filters.role;
      if (filters.isActive) params.isActive = filters.isActive === 'true'; // boolean
      if (filters.hasPaid) params.payment = filters.hasPaid === 'true'; // boolean (assumed)
      if (filters.search) params.search = filters.search;

      const { data } = await axiosInstance.get('/admin/users', { params });
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  // Open details modal
  const openDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  // Close details modal and refresh users on update
  const onDetailsClose = (updated) => {
    setIsDetailsOpen(false);
    setSelectedUser(null);
    if (updated) fetchUsers();
  };

  // Deactivate/reactivate user
  const toggleActive = async (user) => {
    try {
      const action = user.isActive ? 'deactivate' : 'reactivate';
      await axiosInstance.patch(`/admin/users/${user._id}/${action}`);
      fetchUsers();
    } catch (err) {
      console.error(`Failed to ${user.isActive ? 'deactivate' : 'reactivate'} user`, err);
    }
  };

  // Delete user (open confirm dialog)
  const confirmDelete = (user) => {
    setConfirmData({ action: 'delete', user });
    setConfirmOpen(true);
  };

  // Handle confirm dialog OK
  const onConfirmOk = async () => {
    if (confirmData.action === 'delete' && confirmData.user) {
      try {
        await axiosInstance.delete(`/admin/users/${confirmData.user._id}`);
        setConfirmOpen(false);
        setConfirmData({ action: '', user: null });
        fetchUsers();
      } catch (err) {
        console.error('Failed to delete user', err);
      }
    }
  };

  // Handle confirm cancel
  const onConfirmCancel = () => {
    setConfirmOpen(false);
    setConfirmData({ action: '', user: null });
  };

  // Extract roles from users for dropdown options
  const roles = useMemo(() => {
    const setRoles = new Set(users.map((u) => u.role));
    return Array.from(setRoles).filter(Boolean);
  }, [users]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaBell />}
          onClick={() => navigate('/notifications')}
        >
          Send Notifications
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Select
          displayEmpty
          value={filters.role}
          onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
          size="small"
          className="w-full"
        >
          <MenuItem value="">All Roles</MenuItem>
          {[...new Set(['admin', 'supervisor', 'student', ...roles])].map((r) => (
            <MenuItem key={r} value={r}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </MenuItem>
          ))}
        </Select>

        <Select
          displayEmpty
          value={filters.isActive}
          onChange={(e) => setFilters((f) => ({ ...f, isActive: e.target.value }))}
          size="small"
          className="w-full"
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="true">Active</MenuItem>
          <MenuItem value="false">Inactive</MenuItem>
        </Select>

        <Select
          displayEmpty
          value={filters.hasPaid}
          onChange={(e) => setFilters((f) => ({ ...f, hasPaid: e.target.value }))}
          size="small"
          className="w-full"
        >
          <MenuItem value="">All Payments</MenuItem>
          <MenuItem value="true">Paid</MenuItem>
          <MenuItem value="false">Unpaid</MenuItem>
        </Select>

        <TextField
          size="small"
          placeholder="Search by name or email"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="w-full"
        />
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center mt-20">
          <CircularProgress />
        </div>
      ) : (
        <div className="overflow-x-auto border rounded shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Role</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Active</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Paid</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="px-4 py-2">{user.fullName || '-'}</td>
                  <td className="px-4 py-2">{user.email || '-'}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">
                    {user.isActive ? (
                      <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{user.hasPaid ? 'Paid' : 'Unpaid'}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <Tooltip title="View / Edit">
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => openDetails(user)}
                        startIcon={<FaEye />}
                      />
                    </Tooltip>

                    <Tooltip title={user.isActive ? 'Deactivate' : 'Reactivate'}>
                      <Button
                        size="small"
                        variant="outlined"
                        color={user.isActive ? 'error' : 'success'}
                        onClick={() => toggleActive(user)}
                        startIcon={user.isActive ? <FaToggleOff /> : <FaToggleOn />}
                      />
                    </Tooltip>

                    <Tooltip title="Delete">
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => confirmDelete(user)}
                        startIcon={<FaTrash />}
                      />
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {isDetailsOpen && selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={onDetailsClose} />
      )}

      {confirmOpen && (
        <ConfirmDialog
          open={confirmOpen}
          title="Confirm Delete"
          description={`Are you sure you want to delete user "${confirmData.user?.fullName}"? This action is irreversible.`}
          onCancel={onConfirmCancel}
          onConfirm={onConfirmOk}
        />
      )}
    </div>
  );
};

export default UsersList;
