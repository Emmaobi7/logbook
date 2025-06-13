// src/components/UserDetailsModal.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';

const roles = ['admin', 'supervisor', 'student'];

const UserDetailsModal = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    role: user.role || 'student',
    isActive: user.isActive || false,
    hasPaid: user.hasPaid || false,
    id: user._id || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) => {
    const value = field === 'isActive' || field === 'hasPaid' ? e.target.checked : e.target.value;
    setFormData((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
        console.log(formData)
      await axiosInstance.put(`/admin/users/${user._id}`, formData);
      onClose(true);
    } catch (err) {
        console.log(err)
      setError(err?.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={() => onClose(false)} 
      PaperProps={{
    sx: {
      width: '90%',         // full width
      maxWidth: '400px',     // max width for small screens
      mx: 2                  // horizontal margin to avoid screen edges
    }
  }}
    >
      <DialogTitle>Edit User: {user.fullName}</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
          value={formData.fullName}
          onChange={handleChange('fullName')}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange('email')}
          type="email"
        />
        <TextField
          select
          label="Role"
          fullWidth
          margin="normal"
          value={formData.role}
          onChange={handleChange('role')}
        >
          {roles.map((role) => (
            <MenuItem key={role} value={role}>
              {role == 'supervisor' ? role = 'Preceptor' : role.charAt(0).toUpperCase() + role.slice(1)}
            </MenuItem>
          ))}
        </TextField>

        <FormControlLabel
          control={
            <Switch
              checked={formData.isActive}
              onChange={handleChange('isActive')}
              color="primary"
            />
          }
          label="Active"
        />

        <FormControlLabel
          control={
            <Switch
              checked={formData.hasPaid}
              onChange={handleChange('hasPaid')}
              color="primary"
            />
          }
          label="Has Paid"
        />

        {error && <p className="text-red-600 mt-2">{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
           sx={{
    mt: 2,
    backgroundColor: '#de7225',
    '&:hover': {
      backgroundColor: '#c96120',
    },
  }}
          disabled={loading}
          startIcon={loading && <CircularProgress size={18} />}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailsModal;
