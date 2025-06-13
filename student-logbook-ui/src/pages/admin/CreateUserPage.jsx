// CreateUserPage.jsx
import React, { useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Container,
  Box,
  FormHelperText,
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from '../../utils/axiosInstance';
import Sidebar from "./SideBar";

const CreateUserPage = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    role: '',
    password: '',
    password2: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = () => {
    const { password, password2 } = form;
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    if (password !== password2) return "Passwords don't match!";
    if (!/[^A-Za-z0-9]/.test(password)) {
      return "Password must contain a special character";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pwdError = validatePassword();
    if (pwdError) {
      setErrors({ password: pwdError });
      return;
    }
    try {
      await axios.post('/auth/register', {
        fullName: form.fullName,
        email: form.email,
        role: form.role,
        password: form.password,
      });
      toast.success('User created successfully');
      alert('user created successfully!');
      setForm({ fullName: '', email: '', role: '', password: '', password2: '' });
      setErrors({});
    } catch (err) {
        console.log(err)
        alert(err.response?.data?.message || 'Failed to create user')
      toast.error(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />
            <div className="md:ml-64 flex-1 p-4">
    <Container maxWidth="sm"  className="flex-1 p-4 mt-16 ml-64" >
      <Box component="form" onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <Typography variant="h5" gutterBottom>
          Create New User
        </Typography>

        <TextField
          name="fullName"
          label="Full Name"
          fullWidth
          margin="normal"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <TextField
          name="email"
          label="Email"
          fullWidth
          margin="normal"
          value={form.email}
          onChange={handleChange}
          required
        />

        <TextField
          name="role"
          label="Role"
          select
          fullWidth
          margin="normal"
          value={form.role}
          onChange={handleChange}
          required
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="supervisor">Preceptor</MenuItem>
          <MenuItem value="student">Student</MenuItem>
        </TextField>

        <TextField
          name="password"
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={form.password}
          onChange={handleChange}
          error={!!errors.password}
          required
        />

        <TextField
          name="password2"
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          value={form.password2}
          onChange={handleChange}
          error={!!errors.password}
          required
        />

        {errors.password && (
          <FormHelperText error>{errors.password}</FormHelperText>
        )}

        <Box mt={3}>
          <Button type="submit" variant="contained" 
             sx={{
    mt: 2,
    backgroundColor: '#de7225',
    '&:hover': {
      backgroundColor: '#c96120',
    },
  }}
          fullWidth>
            Create User
          </Button>
        </Box>
      </Box>
    </Container>
    </div>
    </div>
  );
};

export default CreateUserPage;
