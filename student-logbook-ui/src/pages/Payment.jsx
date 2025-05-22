import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import PayButton from '../components/PayButton';

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const navigate = useNavigate();

  const handlePaymentSuccess = async (reference) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post('/payment/verify', {
        reference: reference.reference,
      });
      setPaid(true);
      alert(res.data.message || 'Payment successful!');
      setTimeout(() => {
        navigate('/student/logbook');
      }, 2000);
    } catch (err) {
      console.error('Verification error:', err);
      alert('Payment verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      bgcolor="#f9fafe"
      px={2}
    >
      <Paper elevation={4} sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} textAlign="center" gutterBottom>
          Complete Your Payment
        </Typography>

        <Typography variant="body1" textAlign="center" color="text.secondary" mb={2}>
          Amount: <strong>₦1000</strong>
        </Typography>

        {paid && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Payment successful! Redirecting...
          </Alert>
        )}

        <Box mt={4} textAlign="center">
          <PayButton
            onSuccess={handlePaymentSuccess}
            disabled={loading || paid}
            buttonText="Pay Now"
            className="pay-button"
            style={{
              backgroundColor: '#2e7d32',
              color: '#fff',
              fontWeight: 600,
              padding: '10px 24px',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          {loading && <CircularProgress size={24} sx={{ mt: 3 }} />}
        </Box>
      </Paper>
    </Box>
  );
};

export default Payment;
