const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./utils/db');
const authRoutes = require('./routes/authRoutes');
const logbookRoutes = require('./routes/logbookRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const supervisorRoutes = require('./routes/supervisor');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/auth', authRoutes);
app.use('/api', logbookRoutes);
app.use('/payment', paymentRoutes);
app.use('/supervisor', supervisorRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Student Logbook API');
});

// Connect DB and Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
