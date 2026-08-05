const Record = require('../models/Record');
const User = require('../models/User');

// @desc    Upload a new medical record (EHR)
// @route   POST /api/ehr/upload
// @access  Private (Hospital)
exports.uploadRecord = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const { patientId, title, type, notes } = req.body;

        // Verify patient exists
        const patient = await User.findById(patientId);
        if (!patient || patient.role !== 'patient') {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        // Create the record
        const record = await Record.create({
            patient: patientId,
            hospital: req.user.id, // Authenticated hospital
            title,
            type,
            notes,
            fileUrl: `/uploads/${req.file.filename}` // Will be served statically
        });

        res.status(201).json({
            success: true,
            data: record
        });
    } catch (error) {
        console.error('Error uploading record:', error);
        res.status(500).json({ success: false, message: 'Server error uploading record' });
    }
};

// @desc    Get records for a specific patient
// @route   GET /api/ehr/patient/:patientId
// @access  Private (Patient or Admin or Hospital)
exports.getPatientRecords = async (req, res) => {
    try {
        const patientId = req.params.patientId === 'me' ? req.user.id : req.params.patientId;
        
        // Find records and populate hospital name
        const records = await Record.find({ patient: patientId })
            .populate('hospital', 'name')
            .sort('-createdAt');
            
        res.status(200).json({
            success: true,
            data: records
        });
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ success: false, message: 'Server error fetching records' });
    }
};
