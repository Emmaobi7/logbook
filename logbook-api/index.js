const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./utils/db'); // ✅ your DB connection file
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/auth', authRoutes);

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
