const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const connectDB = require('./utils/db');
const authRoutes = require('./routes/authRoutes');
const logbookRoutes = require('./routes/logbookRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const supervisorRoutes = require('./routes/supervisor');
const studentProfileRoutes = require('./routes/studentProfile');
const supervisorProfileRoutes = require('./routes/supervisorProfile');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// API Routes
app.use('/auth', authRoutes);
app.use('/api', logbookRoutes);
app.use('/payment', paymentRoutes);
app.use('/supervisor', supervisorRoutes);
app.use('/student', studentProfileRoutes);
app.use('/supervisor-profile', supervisorProfileRoutes);


const publicUploadsPath = path.join(__dirname, "public/uploads");
app.use("/uploads", express.static(publicUploadsPath));

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
