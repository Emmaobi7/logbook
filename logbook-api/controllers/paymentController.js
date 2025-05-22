const axios = require('axios');
const Student = require('../models/User');
const Transaction = require('../models/Transaction');

exports.verifyPayment = async (req, res) => {
  const { reference } = req.body;

  if (!reference) {
    return res.status(400).json({ message: 'Payment reference is required.' });
  }

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = response.data?.data;

    if (!data || data.status !== 'success') {
      return res.status(400).json({ message: 'Payment not verified.' });
    }

    const student = await Student.findById(req.user.userId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // ✅ Check if student already paid
    if (student.hasPaid) {
      return res.status(200).json({ message: 'Payment already verified. Logbook access granted.' });
    }

    // ✅ Proceed to save payment details
    student.hasPaid = true;
    student.paymentDetails = {
      amount: data.amount,
      date: data.paid_at,
      method: data.channel,
      ref: data.reference,
      currency: process.env.PAYMENT_CURRENCY,
    };

    await student.save();


    await Transaction.create({
      student: student._id,
      reference: data.reference,
      amount: data.amount,
      currency: process.env.PAYMENT_CURRENCY,
      method: data.channel,
      status: data.status,
      paidAt: data.paid_at,
    });


    return res.json({ message: 'Payment verified. Logbook access granted.' });

  } catch (error) {
    console.error('Verification error:', error.message);
    return res.status(500).json({ message: 'Error verifying payment.' });
  }
};





exports.handleWebhook = async (req, res) => {
  const event = req.body;

  // Only process successful payments
  if (event.event === 'charge.success') {
    const data = event.data;

    try {
      const student = await Student.findOne({ email: data.customer.email }); // Or use metadata

      if (student) {
        student.hasPaid = true;
        student.paymentDetails = {
          amount: data.amount,
          date: data.paid_at,
          method: data.channel,
          ref: data.reference,
          currency: data.currency,
        };

        await student.save();
      }
    } catch (err) {
      console.error('Webhook processing error:', err.message);
    }
  }

  res.sendStatus(200); // Acknowledge receipt
};
