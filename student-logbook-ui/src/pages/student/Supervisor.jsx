import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import Sidebar from '../../components/layout/Sidebar';

const SupervisorInviteForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await axiosInstance.post('/supervisor/invite', { name, email });
      setSuccessMsg(res.data.message || 'Invite sent successfully!');
      setName('');
      setEmail('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to send invite.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <Box mt={10} maxWidth="400px" mx="auto">
            
        <Typography variant="h6" gutterBottom>
            Invite Your Preceptor
        </Typography>

        {successMsg && <Alert severity="success">{successMsg}</Alert>}
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <form onSubmit={handleSubmit}>
            <TextField
            fullWidth
            margin="normal"
            label="Preceptor Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            />
            <TextField
            fullWidth
            margin="normal"
            label="Preceptor Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />

            <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{ mt: 2 }}
            >
            {loading ? 'Sending...' : 'Send Invite'}
            </Button>
        </form>
        </Box>
    </div>
  );
};

export default SupervisorInviteForm;
