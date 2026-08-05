const HealthScheme = require('../models/HealthScheme');
const Claim = require('../models/Claim');
const User = require('../models/User');
const Hospital = require('../models/Hospital');

// @desc    Get all schemes
// @route   GET /api/schemes
// @access  Private
exports.getAllSchemes = async (req, res) => {
    try {
        const schemes = await HealthScheme.find({ isActive: true });
        res.status(200).json({ success: true, data: schemes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Create a scheme (Admin)
// @route   POST /api/schemes
// @access  Private (Admin)
exports.createScheme = async (req, res) => {
    try {
        const scheme = await HealthScheme.create(req.body);
        res.status(201).json({ success: true, data: scheme });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Check patient eligibility
// @route   GET /api/schemes/eligibility/:patientId
// @access  Private
exports.checkEligibility = async (req, res) => {
    try {
        const patient = await User.findById(req.params.patientId);
        if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

        const schemes = await HealthScheme.find({ isActive: true });
        const eligibleSchemes = schemes.filter(scheme => {
            const incomeOk = patient.annualIncome != null && patient.annualIncome <= scheme.incomeLimit;
            const categoryOk = scheme.eligibleCategories.includes(patient.category);
            // Example logic: Either low income or specific category
            return incomeOk || categoryOk;
        });

        res.status(200).json({ success: true, data: eligibleSchemes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Create a claim (Hospital)
// @route   POST /api/schemes/claim
// @access  Private (Hospital)
exports.createClaim = async (req, res) => {
    try {
        const { patientId, schemeId, totalBillAmount } = req.body;
        
        let scheme = null;
        if (schemeId) {
            scheme = await HealthScheme.findById(schemeId);
        }
        
        let claimAmount = 0;
        let patientPayable = totalBillAmount;
        
        if (scheme) {
            claimAmount = Math.min(totalBillAmount, scheme.maxCoverageAmount);
            patientPayable = totalBillAmount - claimAmount;
        }

        const claim = await Claim.create({
            hospital: req.user.id,
            patient: patientId,
            schemeApplied: schemeId || null,
            totalBillAmount,
            claimAmount,
            patientPayable,
            status: 'Pending'
        });

        res.status(201).json({ success: true, data: claim });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get claims for a hospital
// @route   GET /api/schemes/hospital-claims
// @access  Private (Hospital)
exports.getHospitalClaims = async (req, res) => {
    try {
        const claims = await Claim.find({ hospital: req.user.id })
            .populate('patient', 'full_name aadharNumber')
            .populate('schemeApplied', 'name')
            .sort({ createdAt: -1 });
            
        res.status(200).json({ success: true, data: claims });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get all claims (Admin)
// @route   GET /api/schemes/admin-claims
// @access  Private (Admin)
exports.getAdminClaims = async (req, res) => {
    try {
        const claims = await Claim.find()
            .populate('hospital', 'name')
            .populate('patient', 'full_name rationCardNumber aadharNumber category')
            .populate('schemeApplied', 'name')
            .sort({ createdAt: -1 });
            
        res.status(200).json({ success: true, data: claims });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Update claim status (Admin)
// @route   PUT /api/schemes/claim/:id
// @access  Private (Admin)
exports.updateClaimStatus = async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const claim = await Claim.findByIdAndUpdate(
            req.params.id, 
            { status, remarks },
            { new: true }
        ).populate('hospital', 'name').populate('patient', 'full_name');
        
        if (!claim) return res.status(404).json({ success: false, message: 'Claim not found' });
        
        res.status(200).json({ success: true, data: claim });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
