const Hospital = require('../models/Hospital');

// @desc    Register a new hospital (pending approval)
// @route   POST /api/hospitals
// @access  Public
exports.registerHospital = async (req, res) => {
    try {
        const hospital = await Hospital.create(req.body);
        res.status(201).json({ success: true, data: hospital, message: 'Hospital registered. Pending admin approval.' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all APPROVED hospitals
// @route   GET /api/hospitals/public
// @access  Public
exports.getApprovedHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find({ isApproved: true });
        res.status(200).json({ success: true, count: hospitals.length, data: hospitals });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all PENDING hospitals
// @route   GET /api/hospitals/pending
// @access  Private/Admin
exports.getPendingHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find({ isApproved: false });
        res.status(200).json({ success: true, count: hospitals.length, data: hospitals });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Approve a hospital
// @route   PUT /api/hospitals/:id/approve
// @access  Private/Admin
exports.approveHospital = async (req, res) => {
    try {
        let hospital = await Hospital.findById(req.params.id);
        
        if (!hospital) {
            return res.status(404).json({ success: false, message: 'Hospital not found' });
        }

        hospital.isApproved = true;
        await hospital.save();

        res.status(200).json({ success: true, data: hospital, message: 'Hospital approved successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get current logged in hospital profile
// @route   GET /api/hospitals/profile
// @access  Private (Hospital)
exports.getHospitalProfile = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.user.id);
        if (!hospital) {
            return res.status(404).json({ success: false, message: 'Hospital not found' });
        }
        res.status(200).json({ success: true, data: hospital });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update current logged in hospital profile
// @route   PUT /api/hospitals/profile
// @access  Private (Hospital)
exports.updateHospitalProfile = async (req, res) => {
    try {
        // Find hospital and update. Exclude password from being updated here.
        const fieldsToUpdate = { ...req.body };
        delete fieldsToUpdate.password;
        delete fieldsToUpdate.username;

        const hospital = await Hospital.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        if (!hospital) {
            return res.status(404).json({ success: false, message: 'Hospital not found' });
        }

        res.status(200).json({ success: true, data: hospital, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Upload hospital logo
// @route   POST /api/hospitals/upload/logo
// @access  Private (Hospital)
exports.uploadHospitalLogo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image file' });
        }
        const logoUrl = `/uploads/${req.file.filename}`;
        const hospital = await Hospital.findByIdAndUpdate(req.user.id, { logo: logoUrl }, { new: true });
        res.status(200).json({ success: true, data: hospital, message: 'Logo uploaded successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Upload hospital cover image
// @route   POST /api/hospitals/upload/cover
// @access  Private (Hospital)
exports.uploadHospitalCover = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image file' });
        }
        const coverUrl = `/uploads/${req.file.filename}`;
        const hospital = await Hospital.findByIdAndUpdate(req.user.id, { coverImage: coverUrl }, { new: true });
        res.status(200).json({ success: true, data: hospital, message: 'Cover image uploaded successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const Appointment = require('../models/Appointment');

// @desc    Get hospital appointments
// @route   GET /api/hospital/appointments
// @access  Private (Hospital)
exports.getHospitalAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ hospital: req.user.id })
            .populate('patient', 'full_name age gender phone blood_group')
            .populate('doctor', 'name specialization')
            .sort({ date: 1 });
            
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        console.error('Error fetching hospital appointments:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update appointment status
// @route   PUT /api/hospital/appointments/:id
// @access  Private (Hospital)
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        let appointment = await Appointment.findById(req.params.id);
        
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }
        
        // Make sure appointment belongs to this hospital
        if (appointment.hospital.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this appointment' });
        }
        
        appointment.status = status;
        await appointment.save();
        
        appointment = await Appointment.findById(req.params.id)
            .populate('patient', 'full_name age gender phone')
            .populate('doctor', 'name specialization');
            
        res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        console.error('Error updating appointment status:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
