// src/pages/Register.jsx
import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box, MenuItem } from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const roles = ['student', 'supervisor']; // Only selectable roles (admin not public)

function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'student' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register', form);
      alert('Registration successful');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={5}>
        <Typography variant="h5" gutterBottom>Register</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Full Name" name="fullName" fullWidth margin="normal" onChange={handleChange} />
          <TextField label="Email" name="email" fullWidth margin="normal" onChange={handleChange} />
          <TextField label="Password" type="password" name="password" fullWidth margin="normal" onChange={handleChange} />
          <TextField
            label="Role"
            name="role"
            select
            fullWidth
            margin="normal"
            value={form.role}
            onChange={handleChange}
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Register</Button>
        </form>
      </Box>
    </Container>
  );
}

export default Register;
