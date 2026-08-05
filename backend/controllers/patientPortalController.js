const User = require('../models/User');
const Prescription = require('../models/Prescription');
const LabReport = require('../models/LabReport');

// @desc    Get patient profile (self)
// @route   GET /api/my-portal/profile
// @access  Private (Patient)
exports.getPatientProfile = async (req, res) => {
    try {
        const patient = await User.findById(req.user.id)
            .populate('assignedHospital', 'name address city phone type')
            .populate('assignedDoctor', 'name specialization');

        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient profile not found' });
        }

        res.status(200).json({ success: true, data: patient });
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update patient profile
// @route   PUT /api/my-portal/profile
// @access  Private (Patient)
exports.updatePatientProfile = async (req, res) => {
    try {
        const { full_name, phone, address, age, blood_group } = req.body;

        const updatedPatient = await User.findByIdAndUpdate(
            req.user.id,
            { full_name, phone, address, age, blood_group },
            { new: true, runValidators: true }
        ).populate('assignedHospital').populate('assignedDoctor');

        res.status(200).json({ success: true, data: updatedPatient });
    } catch (error) {
        console.error('Error updating patient profile:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get patient records (Prescriptions and Lab Reports)
// @route   GET /api/my-portal/records
// @access  Private (Patient)
exports.getPatientRecords = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ patient: req.user.id })
            .populate('doctor', 'name specialization')
            .populate('hospital', 'name')
            .sort({ date: -1 });

        const labReports = await LabReport.find({ patient: req.user.id })
            .populate('doctor', 'name specialization')
            .populate('hospital', 'name')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            data: {
                prescriptions,
                labReports
            }
        });
    } catch (error) {
        console.error('Error fetching patient records:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const Appointment = require('../models/Appointment');

// @desc    Get patient appointments (Mock implementation for now)
// @route   GET /api/my-portal/appointments
// @access  Private (Patient)
exports.getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user.id })
            .populate('doctor', 'name specialization')
            .populate('hospital', 'name address')
            .sort({ date: 1 });
            
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');

// @desc    Get hospitals for booking
// @route   GET /api/my-portal/hospitals
// @access  Private (Patient)
exports.getHospitalsForBooking = async (req, res) => {
    try {
        const hospitals = await Hospital.find({ status: 'Approved' }).select('name address city');
        // If status is not used, just fetch all
        const allHospitals = hospitals.length > 0 ? hospitals : await Hospital.find().select('name address city');
        console.log('Sending hospitals:', allHospitals.length); res.status(200).json({ success: true, data: allHospitals });
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get doctors by hospital for booking
// @route   GET /api/my-portal/doctors/:hospitalId
// @access  Private (Patient)
exports.getDoctorsForBooking = async (req, res) => {
    try {
        const doctors = await Doctor.find({ hospital: req.params.hospitalId }).select('name specialization department');
        res.status(200).json({ success: true, data: doctors });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Book an appointment
// @route   POST /api/my-portal/appointments
// @access  Private (Patient)
exports.bookAppointment = async (req, res) => {
    try {
        const { hospital, doctor, date, time, type, reason } = req.body;

        if (!hospital || !doctor || !date || !time || !reason) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        const appointment = await Appointment.create({
            patient: req.user.id,
            hospital,
            doctor,
            date,
            time,
            type: type || 'Consultation',
            reason,
            status: 'Pending'
        });

        res.status(201).json({ success: true, data: appointment });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const BloodRequest = require('../models/BloodRequest');
const BloodBank = require('../models/BloodBank');

exports.getBloodBankNetwork = async (req, res) => {
    try {
        const inventory = await BloodBank.find().populate('hospital', 'name address city district phone');
        res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        console.error('Error fetching blood network:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getPatientBloodRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find({ patient: req.user.id }).populate('hospital', 'name city phone').sort({ date: -1 });
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.createBloodRequest = async (req, res) => {
    try {
        const { hospital, type, bloodGroup, units } = req.body;
        if (!hospital || !type || !bloodGroup) {
            return res.status(400).json({ success: false, message: 'Missing fields' });
        }
        const request = await BloodRequest.create({ patient: req.user.id, hospital, type, bloodGroup, units: units || 1 });
        res.status(201).json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
