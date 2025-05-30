// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const sanitizeBody = require('./utils/sanitize')

require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const logbookRoutes = require('./routes/logbookRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const supervisorRoutes = require('./routes/supervisor');
const studentProfileRoutes = require('./routes/studentProfile');
const supervisorProfileRoutes = require('./routes/supervisorProfile');
const adminRoutes = require('./routes/adminRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');

const app = express();

// Middleware
const corsOptions = {
  origin: ['http://localhost:5173', `${process.env.CLIENT_URL}`],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(sanitizeBody);

// Public uploads
const publicUploadsPath = path.join(__dirname, "public/uploads");
app.use("/uploads", express.static(publicUploadsPath));

// API Routes
app.use('/auth', authRoutes);
app.use('/api', logbookRoutes);
app.use('/payment', paymentRoutes);
app.use('/supervisor', supervisorRoutes);
app.use('/student', studentProfileRoutes);
app.use('/supervisor-profile', supervisorProfileRoutes);
app.use('/admin', adminRoutes);

// Swagger docs (only in dev)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Student Logbook API');
});

module.exports = app;
