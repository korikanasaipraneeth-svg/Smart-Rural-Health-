const HealthCamp = require('../models/HealthCamp');
const CampRegistration = require('../models/CampRegistration');
const Hospital = require('../models/Hospital');
const User = require('../models/User');

// @desc    Create a new health camp (Hospital)
// @route   POST /api/camps
// @access  Private (Hospital)
exports.createCamp = async (req, res) => {
    try {
        // req.user contains the authenticated hospital if the token has the hospital id
        // Alternatively, the body contains the hospital ID.
        let hospitalId = req.user.id;
        
        // Let's assume the body has the needed fields
        const camp = await HealthCamp.create({
            ...req.body,
            hospital: hospitalId,
            status: 'Upcoming' // Auto-approve per user instruction (mapped to Upcoming)
        });
        
        res.status(201).json({ success: true, data: camp });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get all camps for a specific hospital
// @route   GET /api/camps/hospital
// @access  Private (Hospital)
exports.getHospitalCamps = async (req, res) => {
    try {
        const camps = await HealthCamp.find({ hospital: req.user.id })
            .populate('doctorsAssigned', 'name specialization')
            .sort({ date: 1 });
            
        // Also get registration counts for each camp
        const campsWithCounts = await Promise.all(camps.map(async (camp) => {
            const count = await CampRegistration.countDocuments({ camp: camp._id });
            return { ...camp.toObject(), registeredCount: count };
        }));

        res.status(200).json({ success: true, data: campsWithCounts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get all camps (Admin or General Feed)
// @route   GET /api/camps
// @access  Private (Admin / Patient)
exports.getAllCamps = async (req, res) => {
    try {
        let query = {};
        if (req.user && req.user.role === 'patient') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            // Patients only see Upcoming and Live camps in the future or today
            query = { status: { $in: ['Upcoming', 'Live'] }, date: { $gte: today } };
        }
        
        const camps = await HealthCamp.find(query)
            .populate('hospital', 'name district city address')
            .sort({ date: 1 });
            
        res.status(200).json({ success: true, data: camps });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Admin approve or update a camp
// @route   PUT /api/camps/:id
// @access  Private (Admin / Hospital)
exports.updateCamp = async (req, res) => {
    try {
        const camp = await HealthCamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!camp) {
            return res.status(404).json({ success: false, message: 'Camp not found' });
        }
        res.status(200).json({ success: true, data: camp });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Patient registers for a camp
// @route   POST /api/camps/:id/register
// @access  Private (Patient)
exports.registerForCamp = async (req, res) => {
    try {
        const campId = req.params.id;
        const patientId = req.user.id;
        
        const camp = await HealthCamp.findById(campId);
        if (!camp) {
            return res.status(404).json({ success: false, message: 'Camp not found' });
        }
        
        const existing = await CampRegistration.findOne({ camp: campId, patient: patientId });
        if (existing) {
            return res.status(400).json({ success: false, message: 'You are already registered for this camp' });
        }
        
        const count = await CampRegistration.countDocuments({ camp: campId });
        if (count >= camp.maxPatients) {
            return res.status(400).json({ success: false, message: 'Camp has reached maximum capacity' });
        }
        
        const tokenNumber = `CAMP-${campId.toString().substring(18)}-${count + 1}`;
        const qrCodeString = `${campId}-${patientId}-${tokenNumber}`;
        
        const reg = await CampRegistration.create({
            patient: patientId,
            camp: campId,
            tokenNumber,
            qrCodeString,
            symptoms: req.body.symptoms
        });
        
        res.status(201).json({ success: true, data: reg });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get patient's own registrations
// @route   GET /api/camps/my-registrations
// @access  Private (Patient)
exports.getMyRegistrations = async (req, res) => {
    try {
        const registrations = await CampRegistration.find({ patient: req.user.id })
            .populate({
                path: 'camp',
                populate: { path: 'hospital', select: 'name city district' }
            })
            .sort({ createdAt: -1 });
            
        res.status(200).json({ success: true, data: registrations });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get all registrations for a specific camp (Hospital)
// @route   GET /api/camps/:id/registrations
// @access  Private (Hospital)
exports.getCampRegistrations = async (req, res) => {
    try {
        const registrations = await CampRegistration.find({ camp: req.params.id })
            .populate('patient', 'full_name phone age gender blood_group')
            .sort({ createdAt: 1 });
            
        res.status(200).json({ success: true, data: registrations });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Update a patient's registration status (Hospital check-in)
// @route   PUT /api/camps/registrations/:regId
// @access  Private (Hospital)
exports.updateRegistrationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const reg = await CampRegistration.findByIdAndUpdate(req.params.regId, { status }, { new: true });
        
        if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });
        
        res.status(200).json({ success: true, data: reg });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
