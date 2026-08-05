const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');

// @desc    Get all doctors (filtered by hospital)
// @route   GET /api/doctors
// @access  Private (Hospital)
exports.getDoctors = async (req, res) => {
    try {
        let query = {};
        
        // If hospital is logged in, only show their doctors
        if (req.user.role === 'hospital') {
            query.hospital = req.user.id;
        }

        // Search by name or specialization
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { specialization: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        if (req.query.department) {
            query.department = req.query.department;
        }

        const doctors = await Doctor.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Private
exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('hospital', 'name email address');

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // Make sure hospital can only view their own doctors
        if (req.user.role === 'hospital' && doctor.hospital._id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to view this doctor' });
        }

        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Add new doctor
// @route   POST /api/doctors
// @access  Private (Hospital)
exports.addDoctor = async (req, res) => {
    try {
        // Add hospital to req.body
        req.body.hospital = req.user.id;

        // If email and password provided, hash the password (optional login capability)
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const doctor = await Doctor.create(req.body);

        res.status(201).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        console.error('Error adding doctor:', error);
        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        if (error.code === 11000) {
             return res.status(400).json({ success: false, message: 'Registration number or email already exists' });
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private (Hospital)
exports.updateDoctor = async (req, res) => {
    try {
        let doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // Make sure hospital owns doctor
        if (doctor.hospital.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this doctor' });
        }

        // Prevent password update through this route
        if (req.body.password) {
            delete req.body.password;
        }

        doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private (Hospital)
exports.deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // Make sure hospital owns doctor
        if (doctor.hospital.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this doctor' });
        }

        await doctor.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
