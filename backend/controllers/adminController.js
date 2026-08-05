const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const Disease = require('../models/Disease');
const Feedback = require('../models/Feedback');
const BloodBank = require('../models/BloodBank');
const BloodRequest = require('../models/BloodRequest');

// @desc    Get all patients
// @route   GET /api/admin/patients
// @access  Public (for now)
exports.getPatients = async (req, res) => {
    try {
        const patients = await User.find({ role: 'patient' });
        res.status(200).json({ success: true, count: patients.length, data: patients });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Public
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json({ success: true, count: doctors.length, data: doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get all hospitals
// @route   GET /api/admin/hospitals
// @access  Public
exports.getHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.status(200).json({ success: true, count: hospitals.length, data: hospitals });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get all diseases
// @route   GET /api/admin/diseases
// @access  Public
exports.getDiseases = async (req, res) => {
    try {
        const diseases = await Disease.find();
        res.status(200).json({ success: true, count: diseases.length, data: diseases });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get all feedback
// @route   GET /api/admin/feedback
// @access  Public
exports.getFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find();
        res.status(200).json({ success: true, count: feedback.length, data: feedback });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Public
exports.getStats = async (req, res) => {
    try {
        const patientCount = await User.countDocuments({ role: 'patient' });
        const doctorCount = await Doctor.countDocuments();
        const hospitalCount = await Hospital.countDocuments();
        const diseaseCount = await Disease.countDocuments();
        
        res.status(200).json({ 
            success: true, 
            data: {
                patients: patientCount,
                doctors: doctorCount,
                hospitals: hospitalCount,
                diseases: diseaseCount
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Add new patient
// @route   POST /api/admin/patients
// @access  Public
exports.addPatient = async (req, res) => {
    try {
        req.body.role = 'patient';
        const item = await User.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
    }
};

// @desc    Update patient
// @route   PUT /api/admin/patients/:id
// @access  Public
exports.updatePatient = async (req, res) => {
    try {
        const item = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
    }
};

// @desc    Delete patient
// @route   DELETE /api/admin/patients/:id
// @access  Public
exports.deletePatient = async (req, res) => {
    try {
        const item = await User.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
    }
};

// @desc    Add new doctor
// @route   POST /api/admin/doctors
// @access  Public
exports.addDoctor = async (req, res) => {
    try {
        
        const item = await Doctor.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
    }
};

// @desc    Update doctor
// @route   PUT /api/admin/doctors/:id
// @access  Public
exports.updateDoctor = async (req, res) => {
    try {
        const item = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
    }
};

// @desc    Delete doctor
// @route   DELETE /api/admin/doctors/:id
// @access  Public
exports.deleteDoctor = async (req, res) => {
    try {
        const item = await Doctor.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
    }
};

// @desc    Add new hospital
// @route   POST /api/admin/hospitals
// @access  Public
exports.addHospital = async (req, res) => {
    try {
        
        const item = await Hospital.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
    }
};

// @desc    Update hospital
// @route   PUT /api/admin/hospitals/:id
// @access  Public
exports.updateHospital = async (req, res) => {
    try {
        const item = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Hospital not found' });
        }
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
    }
};

// @desc    Delete hospital
// @route   DELETE /api/admin/hospitals/:id
// @access  Public
exports.deleteHospital = async (req, res) => {
    try {
        const item = await Hospital.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Hospital not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
    }
};

// @desc    Add new disease
// @route   POST /api/admin/diseases
// @access  Public
exports.addDisease = async (req, res) => {
    try {
        
        const item = await Disease.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
    }
};

// @desc    Update disease
// @route   PUT /api/admin/diseases/:id
// @access  Public
exports.updateDisease = async (req, res) => {
    try {
        const item = await Disease.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Disease not found' });
        }
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
    }
};

// @desc    Delete disease
// @route   DELETE /api/admin/diseases/:id
// @access  Public
exports.deleteDisease = async (req, res) => {
    try {
        const item = await Disease.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Disease not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
    }
};

// @desc    Add new feedback
// @route   POST /api/admin/feedbacks
// @access  Public
exports.addFeedback = async (req, res) => {
    try {
        
        const item = await Feedback.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
    }
};

// @desc    Update feedback
// @route   PUT /api/admin/feedbacks/:id
// @access  Public
exports.updateFeedback = async (req, res) => {
    try {
        const item = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
    }
};

// @desc    Delete feedback
// @route   DELETE /api/admin/feedbacks/:id
// @access  Public
exports.deleteFeedback = async (req, res) => {
    try {
        const item = await Feedback.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
    }
};

// @desc    Get all blood bank inventories
// @route   GET /api/admin/blood-bank
// @access  Private/Admin
exports.getBloodBankNetwork = async (req, res) => {
    try {
        const inventory = await BloodBank.find().populate('hospital', 'name district city phone');
        res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all blood requests
// @route   GET /api/admin/blood-bank/requests
// @access  Private/Admin
exports.getAllBloodRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find()
            .populate('patient', 'full_name phone')
            .populate('hospital', 'name city')
            .sort({ date: -1 });
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
