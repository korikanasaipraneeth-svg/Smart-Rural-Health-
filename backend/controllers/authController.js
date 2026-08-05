const Hospital = require('../models/Hospital');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { full_name, email, phone, password, age, gender, blood_group, address } = req.body;

        // Validation
        if (!full_name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide required fields' });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert into DB
        let role = 'patient';
        if (email.toLowerCase() === 'korikanasaipraneeth@gmail.com') {
            role = 'admin';
        }

        user = await User.create({
            full_name,
            email,
            phone,
            password: hashedPassword,
            age,
            gender,
            blood_group,
            address,
            role
        });

        // Generate Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

// @desc    Register a hospital
// @route   POST /api/auth/hospital/register
exports.registerHospital = async (req, res) => {
    try {
        const { hospitalName, regNumber, type, email, phone, emergencyNumber, state, district, city, address, departments, facilities, username, password } = req.body;

        if (!hospitalName || !email || !password || !username) {
            return res.status(400).json({ success: false, message: 'Please provide required fields' });
        }

        let hospital = await Hospital.findOne({ email });
        if (hospital) {
            return res.status(400).json({ success: false, message: 'Hospital already exists with this email' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        hospital = await Hospital.create({
            name: hospitalName,
            regNo: regNumber,
            type,
            email,
            contact_number: phone,
            emergencyNumber,
            state,
            district,
            city,
            address,
            departments,
            facilities,
            username,
            password: hashedPassword,
            status: 'Under Review',
            verification: 'Pending'
        });

        const token = jwt.sign({ id: hospital._id, role: 'hospital' }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            success: true,
            message: 'Hospital registered successfully',
            token,
            user: { id: hospital._id, name: hospital.name, email: hospital.email, role: 'hospital' }
        });
    } catch (error) {
        console.error('Register Hospital Error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
};

// @desc    Login hospital
// @route   POST /api/auth/hospital/login
exports.loginHospital = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const hospital = await Hospital.findOne({ $or: [{ email: email }, { username: email }] }).select('+password');
        
        if (!hospital) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, hospital.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: hospital._id, role: 'hospital' }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: { id: hospital._id, name: hospital.name, email: hospital.email, role: 'hospital' }
        });
    } catch (error) {
        console.error('Login Hospital Error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};
