// src/components/PayButton.jsx
import React from 'react';
import { usePaystackPayment } from 'react-paystack';

const PayButton = ({ onSuccess, disabled = false }) => {
  const user = JSON.parse(localStorage.getItem('user')); // or fetch from context
  console.log(user)
  const config = {
    reference: new Date().getTime().toString(),
    email: user?.email,
    amount: parseInt(import.meta.env.VITE_PAYMENT_AMOUNT), // in kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    currency: import.meta.env.VITE_PAYMENT_CURRENCY || 'NGN',
    metadata: {
      userId: user?.userId,
    },
  };

  const onClose = () => {
    console.log('Payment closed');
  };

  const initializePayment = usePaystackPayment(config);

  return (
    <button
      onClick={() =>
        initializePayment({
          onSuccess: (ref) => onSuccess(ref),
          onClose,
        })
      }
      disabled={disabled} 
      className={`px-4 py-2 text-white rounded transition-colors duration-300 ${
      disabled ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
  }`}

    >
      Pay ₦1000
    </button>
  );
};

export default PayButton;
