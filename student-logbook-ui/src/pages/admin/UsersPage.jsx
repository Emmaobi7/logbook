// src/pages/UsersPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Select,
  MenuItem,
  TextField,
  Button,
  Switch,
  CircularProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  FaEdit,
  FaTrash,
  FaUserSlash,
  FaUserCheck,
} from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';

import UserDetailsModal from './UserDetailsModal';
import ConfirmDialog from './Confirmdialog';
import Sidebar from "./SideBar";

const roles = ['admin', 'supervisor', 'student'];
const statuses = ['active', 'inactive'];
const payments = ['paid', 'unpaid'];

const UsersPage = () => {
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    payment: '',
    isActive: '',
    search: '',
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
    loading: false,
  });

  // Fetch users with filters
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.role) params.role = filters.role;
      if (filters.status) params.status = filters.status;
      if (filters.payment) {
        if (filters.payment === 'paid') params.hasPaid = true;
        if (filters.payment === 'unpaid') params.hasPaid = false;
        }

      if (filters.isActive) params.isActive = filters.isActive === 'true';
      if (filters.search) params.search = filters.search;

        const response = await axiosInstance.get('/admin/users', { params });
        
    
        setUsers(Array.isArray(response.data) ? response.data : response.data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (field) => (e) => {
    setFilters((f) => ({
      ...f,
      [field]: e.target.value,
    }));
  };

  // Open user edit modal
  const handleEdit = (user) => {
    setSelectedUser(user);
  };

  // Close user edit modal, refresh list if saved
  const handleModalClose = (saved) => {
    setSelectedUser(null);
    if (saved) fetchUsers();
  };

  // Soft deactivate user
  const handleDeactivate = (user) => {
    setConfirmDialog({
      open: true,
      title: 'Deactivate User',
      message: `Are you sure you want to deactivate ${user.fullName}?`,
      loading: false,
      onConfirm: async () => {
        setConfirmDialog((c) => ({ ...c, loading: true }));
        try {
          await axiosInstance.patch(`/admin/users/${user._id}/deactivate`);
          setConfirmDialog({ open: false, title: '', message: '', onConfirm: null, loading: false });
          fetchUsers();
        } catch (err) {
          console.error('Deactivate failed:', err);
          setConfirmDialog((c) => ({ ...c, loading: false }));
        }
      },
    });
  };

  // Reactivate user
  const handleReactivate = (user) => {
    setConfirmDialog({
      open: true,
      title: 'Reactivate User',
      message: `Are you sure you want to reactivate ${user.fullName}?`,
      loading: false,
      onConfirm: async () => {
        setConfirmDialog((c) => ({ ...c, loading: true }));
        try {
          await axiosInstance.patch(`/admin/users/${user._id}/reactivate`);
          setConfirmDialog({ open: false, title: '', message: '', onConfirm: null, loading: false });
          fetchUsers();
        } catch (err) {
          console.error('Reactivate failed:', err);
          setConfirmDialog((c) => ({ ...c, loading: false }));
        }
      },
    });
  };

  // Hard delete user
  const handleDelete = (user) => {
    setConfirmDialog({
      open: true,
      title: 'Delete User',
      message: `This action is irreversible. Delete user ${user.fullName}?`,
      loading: false,
      onConfirm: async () => {
        setConfirmDialog((c) => ({ ...c, loading: true }));
        try {
          await axiosInstance.delete(`/admin/users/${user._id}`);
          setConfirmDialog({ open: false, title: '', message: '', onConfirm: null, loading: false });
          fetchUsers();
        } catch (err) {
          console.error('Delete failed:', err);
          setConfirmDialog((c) => ({ ...c, loading: false }));
        }
      },
    });
  };

  return (
     <div className="min-h-screen bg-gray-100 flex">
          <Sidebar />
    <div className="flex-1 p-4 mt-10 md:ml-64">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <Select
          value={filters.role}
          onChange={handleFilterChange('role')}
          displayEmpty
          size="small"
          className="min-w-[140px]"
          variant="outlined"
        >
          <MenuItem value="">All Roles</MenuItem>
          {roles.map((role) => (
            <MenuItem key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1) == 'Supervisor' ? 'preceptor' : role.charAt(0).toUpperCase() + role.slice(1)}
            </MenuItem>
          ))}
        </Select>

        {/* <Select
          value={filters.status}
          onChange={handleFilterChange('status')}
          displayEmpty
          size="small"
          className="min-w-[140px]"
          variant="outlined"
        >
          <MenuItem value="">All Statuses</MenuItem>
          {statuses.map((status) => (
            <MenuItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </MenuItem>
          ))}
        </Select> */}

        <Select
          value={filters.payment}
          onChange={handleFilterChange('payment')}
          displayEmpty
          size="small"
          className="min-w-[140px]"
          variant="outlined"
        >
          <MenuItem value="">All Payments</MenuItem>
          {payments.map((pay) => (
            <MenuItem key={pay} value={pay}>
              {pay.charAt(0).toUpperCase() + pay.slice(1)}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={filters.isActive}
          onChange={handleFilterChange('isActive')}
          displayEmpty
          size="small"
          className="min-w-[140px]"
          variant="outlined"
        >
          <MenuItem value="">All Active States</MenuItem>
          <MenuItem value="true">Active</MenuItem>
          <MenuItem value="false">Inactive</MenuItem>
        </Select>

        <TextField
          placeholder="Search by name or email"
          size="small"
          variant="outlined"
          className="flex-grow min-w-[200px]"
          value={filters.search}
          onChange={handleFilterChange('search')}
        />

        <Button variant="contained" onClick={fetchUsers}>
          Refresh
        </Button>
      </div>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role.charAt(0).toUpperCase() + user.role.slice(1) == 'Supervisor' ? 'preceptor' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}</TableCell>
                  <TableCell>
                    <Switch checked={user.isActive} disabled />
                  </TableCell>
                  <TableCell>
                    {user.hasPaid ? (
                      <span className="text-green-600 font-semibold">Paid</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Unpaid</span>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => handleEdit(user)} size="small">
                        <FaEdit />
                      </IconButton>
                    </Tooltip>

                    {user.isActive ? (
                      <Tooltip title="Deactivate">
                        <IconButton
                          color="warning"
                          onClick={() => handleDeactivate(user)}
                          size="small"
                        >
                          <FaUserSlash />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Reactivate">
                        <IconButton
                          color="success"
                          onClick={() => handleReactivate(user)}
                          size="small"
                        >
                          <FaUserCheck />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(user)} size="small">
                        <FaTrash />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={handleModalClose} />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        loading={confirmDialog.loading}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ open: false, title: '', message: '', onConfirm: null, loading: false })}
      />
    </div>
    </div>
  );
};

export default UsersPage;
