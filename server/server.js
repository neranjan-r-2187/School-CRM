require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const healthRoutes = require('./routes/healthRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const classRoutes = require('./routes/classRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const doubtRoutes = require('./routes/doubtRoutes');



// Load Models (Pre-register for population)
require('./models/User');
require('./models/Student');
require('./models/Teacher');
require('./models/Parent');
require('./models/Class');
require('./models/Subject');
require('./models/Assignment');
require('./models/Attendance');
require('./models/Grade');
require('./models/Ticket');
require('./models/Doubt');


// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://school-crm-blond.vercel.app"
  ],
  credentials: true
})); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: false }));
 


// Basic route for root
app.get('/', (req, res) => {
  res.send('School CRM API is running...');
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/doubts', doubtRoutes);



// Error Handling Middleware (must be after routes)
app.use(errorHandler);

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
