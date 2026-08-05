const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Prescription = require('../models/Prescription');
const LabReport = require('../models/LabReport');
const bcrypt = require('bcryptjs');

// @desc    Get all patients for a hospital
// @route   GET /api/patients
// @access  Private (Hospital)
exports.getHospitalPatients = async (req, res) => {
    try {
        let query = { role: 'patient', assignedHospital: req.user.id };

        // Search by name
        if (req.query.search) {
            query.full_name = { $regex: req.query.search, $options: 'i' };
        }

        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        const patients = await User.find(query)
            .populate('assignedDoctor', 'name specialization')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get patient details with prescriptions and lab reports
// @route   GET /api/patients/:id
// @access  Private (Hospital)
exports.getPatientDetails = async (req, res) => {
    try {
        const patient = await User.findOne({ _id: req.params.id, assignedHospital: req.user.id })
            .populate('assignedDoctor', 'name specialization');

        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        const prescriptions = await Prescription.find({ patient: req.params.id }).populate('doctor', 'name');
        const labReports = await LabReport.find({ patient: req.params.id }).populate('doctor', 'name');

        res.status(200).json({
            success: true,
            data: {
                ...patient._doc,
                prescriptions,
                labReports
            }
        });
    } catch (error) {
        console.error('Error fetching patient details:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Admit/Add new patient
// @route   POST /api/patients/admit
// @access  Private (Hospital)
exports.admitPatient = async (req, res) => {
    try {
        const { full_name, email, phone, age, gender, blood_group, address, assignedDoctor, roomNumber, symptoms, isEmergency, medicalHistory, riskLevel } = req.body;

        // Check if email already exists in system
        let patient = await User.findOne({ email });

        if (patient) {
            // Patient already exists, just update admission details
            patient.assignedHospital = req.user.id;
            patient.assignedDoctor = assignedDoctor;
            patient.roomNumber = roomNumber;
            patient.admissionDate = Date.now();
            patient.symptoms = symptoms ? symptoms.split(',').map(s => s.trim()) : [];
            patient.medicalHistory = medicalHistory ? medicalHistory.split(',').map(m => m.trim()) : [];
            patient.isEmergency = isEmergency || false;
            patient.status = isEmergency ? 'Critical' : 'Under Observation';
            patient.riskLevel = riskLevel || 'Low';
            
            await patient.save();
        } else {
            // Create a brand new patient profile
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Patient123!', salt); // Default password

            patient = await User.create({
                full_name,
                email,
                phone,
                password: hashedPassword,
                age,
                gender,
                blood_group,
                address,
                role: 'patient',
                assignedHospital: req.user.id,
                assignedDoctor,
                roomNumber,
                admissionDate: Date.now(),
                symptoms: symptoms ? symptoms.split(',').map(s => s.trim()) : [],
                medicalHistory: medicalHistory ? medicalHistory.split(',').map(m => m.trim()) : [],
                isEmergency: isEmergency || false,
                status: isEmergency ? 'Critical' : 'Under Observation',
                riskLevel: riskLevel || 'Low'
            });
        }

        const populatedPatient = await User.findById(patient._id).populate('assignedDoctor', 'name specialization');

        res.status(201).json({
            success: true,
            data: populatedPatient
        });
    } catch (error) {
        console.error('Error admitting patient:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update patient status (e.g. Discharge)
// @route   PUT /api/patients/:id/status
// @access  Private (Hospital)
exports.updatePatientStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        let patient = await User.findOne({ _id: req.params.id, assignedHospital: req.user.id });

        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        patient.status = status;
        await patient.save();

        res.status(200).json({
            success: true,
            data: patient
        });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
