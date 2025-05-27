import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Card, CardContent, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { MdNotificationsActive } from 'react-icons/md';
import Sidebar from "./SideBar";

const SentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (roleFilter === 'all') {
      setFiltered(notifications);
    } else {
      const result = notifications.filter(n => n.user?.role === roleFilter);
      setFiltered(result);
    }
  }, [roleFilter, notifications]);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get('/admin/sent');
      setNotifications(res.data.notifications || []);
      setFiltered(res.data.notifications || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />
    <div className="flex-1 p-4 mt-10 md:ml-64">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <MdNotificationsActive className="text-blue-600" />
          Sent Notifications
        </h1>

        <FormControl className="min-w-[150px]">
          <InputLabel id="role-filter-label">Filter by Role</InputLabel>
          <Select
            labelId="role-filter-label"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            label="Filter by Role"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="supervisor">Supervisor</MenuItem>
            <MenuItem value="student">Student</MenuItem>
          </Select>
        </FormControl>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No notifications found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((n, i) => (
            <Card key={i} className="shadow-md">
              <CardContent>
                <Typography variant="subtitle1" className="font-semibold">
                  {n.title}
                </Typography>
                <Typography variant="body2" className="text-gray-700 my-2">
                  {n.message}
                </Typography>
                <Typography variant="caption" className="text-gray-500">
                  To: {n.user?.fullName || 'Unknown'} ({n.user?.role == 'supervisor' ? 'preceptor' : n.user?.role}) <br />
                  Sent: {new Date(n.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default SentNotifications;
