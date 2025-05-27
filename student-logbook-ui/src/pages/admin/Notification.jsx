import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Sidebar from "./SideBar";
import {
  TextField,
  MenuItem,
  Checkbox,
  Button,
  FormControlLabel,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
  CircularProgress,
} from '@mui/material';

const NotificationsPage = () => {
  const [criteria, setCriteria] = useState('');
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [form, setForm] = useState({
    title: '',
    message: '',
    sendEmail: false,
  });

  const [sending, setSending] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');

  // Fetch users when needed
  useEffect(() => {
    if (criteria === 'single' || criteria === 'multiple') {
      fetchUsers();
    }
  }, [criteria]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axiosInstance.get('/admin/users');
      setUserOptions(res.data.users || []);
    } catch (err) {
      console.error(err);
    }
    setLoadingUsers(false);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message || !criteria) {
      alert('Please fill all required fields.');
      return;
    }

    const payload = {
      title: form.title,
      message: form.message,
      sendEmail: form.sendEmail,
      criteria,
    };

    if (criteria === 'single' && selectedUsers.length === 1) {
      payload.userIds = [selectedUsers[0]];
    } else if (criteria === 'multiple') {
      payload.userIds = selectedUsers;
    }

    setSending(true);
    setResponseMsg('');
    try {
      const res = await axiosInstance.post('/admin/users/notify', payload);
      setResponseMsg(res.data.message);
      setForm({ title: '', message: '', sendEmail: false });
      setSelectedUsers([]);
      setCriteria('');
    } catch (err) {
      console.error(err);
      setResponseMsg('Failed to send notifications');
    }
    setSending(false);
  };

  return (
     <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
    <div className="flex-1 p-4 mt-10 md:ml-64">
      <h1 className="text-2xl font-semibold mb-4">Send Notifications</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormControl fullWidth size="small">
          <InputLabel>Criteria</InputLabel>
          <Select
            value={criteria}
            onChange={(e) => setCriteria(e.target.value)}
            label="Criteria"
            required
          >
            <MenuItem value="single">Single User</MenuItem>
            <MenuItem value="multiple">Multiple Users</MenuItem>
            <MenuItem value="students">All Students</MenuItem>
            <MenuItem value="supervisors">All Preceptors</MenuItem>
          </Select>
        </FormControl>

        {(criteria === 'single' || criteria === 'multiple') && (
          <FormControl fullWidth size="small">
            <InputLabel>Select User(s)</InputLabel>
            {loadingUsers ? (
              <CircularProgress size={24} />
            ) : (
              <Select
                multiple={criteria === 'multiple'}
                value={selectedUsers}
                 onChange={(e) =>
                        setSelectedUsers(criteria === 'multiple' ? e.target.value : [e.target.value])
                    }
                input={<OutlinedInput label="Select User(s)" />}
                renderValue={(selected) => (
                  <div className="flex flex-wrap gap-1">
                    {selected.map((id) => {
                      const user = userOptions.find((u) => u._id === id);
                      return (
                        <Chip
                          key={id}
                          label={user?.fullName || 'Unknown'}
                          className="capitalize"
                        />
                      );
                    })}
                  </div>
                )}
              >
                {userOptions.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.fullName} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>
        )}

        <TextField
          label="Title"
          name="title"
          fullWidth
          size="small"
          value={form.title}
          onChange={handleFormChange}
          required
        />

        <TextField
          label="Message"
          name="message"
          fullWidth
          multiline
          rows={4}
          value={form.message}
          onChange={handleFormChange}
          required
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={form.sendEmail}
              onChange={handleFormChange}
              name="sendEmail"
            />
          }
          label="Send Email"
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={sending}
          fullWidth
        >
          {sending ? 'Sending...' : 'Send Notification'}
        </Button>

        {responseMsg && (
          <p className="text-center text-sm text-green-600">{responseMsg}</p>
        )}
      </form>
    </div>
    </div>
  );
};

export default NotificationsPage;
