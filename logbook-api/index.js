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
const adminRoutes = require('./routes/adminRoutes');


const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');




const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', `${process.env.CLIENT_URL}`],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());


// API Routes
app.use('/auth', authRoutes);
app.use('/api', logbookRoutes);
app.use('/payment', paymentRoutes);
app.use('/supervisor', supervisorRoutes);
app.use('/student', studentProfileRoutes);
app.use('/supervisor-profile', supervisorProfileRoutes);
app.use('/admin', adminRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}



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
