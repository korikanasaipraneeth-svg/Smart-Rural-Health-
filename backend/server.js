const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const app = express();

// Security Middleware
app.use(helmet());
// app.use(mongoSanitize()); // Removed due to Express 5 compatibility bug with req.query

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: { success: false, message: 'Too many requests from this IP, please try again later' }
});
app.use('/api/', limiter);

// Basic Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5175', 'http://localhost:5176'],
    credentials: true
}));
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const adminRoutes = require('./routes/adminRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const patientPortalRoutes = require('./routes/patientPortalRoutes');
const scanRoutes = require('./routes/scanRoutes');
const ehrRoutes = require('./routes/ehrRoutes');
const healthCampRoutes = require('./routes/healthCampRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const path = require('path');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes); // Hospital managing patients
app.use('/api/emergency', emergencyRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/my-portal', patientPortalRoutes); // Patient portal
app.use('/api/scan', scanRoutes);
app.use('/api/ehr', ehrRoutes);
app.use('/api/camps', healthCampRoutes);
app.use('/api/schemes', schemeRoutes);

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Base route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Smart Rural Healthcare API is running...' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
