// components/PaymentRequired.jsx
import React from 'react';
import { Box, Typography, Button, Card, CardContent, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PaymentIcon from '@mui/icons-material/Payment';


const PaymentRequired = () => {
  const navigate = useNavigate();

  const handlePayClick = () => {
    navigate('/payment');
  };

  const handleBackClick = () => {
    navigate('/student/dashboard');
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      bgcolor="background.default"
      px={2}
    >
      <Card sx={{ width: '100%', maxWidth: 420, p: 4, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Box display="flex" justifyContent="center" mb={2}>
            <PaymentIcon sx={{ fontSize: 48, color: 'primary.main' }} />
          </Box>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Payment Required
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            You need to complete a one-time payment to access and update your student logbook.
          </Typography>

          <Stack spacing={2}>
            <Button
              variant="contained"
              size="large"
              color="success"
              onClick={handlePayClick}
            >
              Pay Now
            </Button>

            <Button variant="outlined" size="large" onClick={handleBackClick}>
              Back to Dashboard
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentRequired;
