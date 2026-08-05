const express = require('express');
const router = express.Router();
const {
    checkEligibility,
    createClaim,
    getHospitalClaims,
    getAdminClaims,
    updateClaimStatus,
    getAllSchemes,
    createScheme
} = require('../controllers/schemeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public/Patient routes
router.get('/eligibility/:patientId', protect, checkEligibility);
router.get('/', protect, getAllSchemes);

// Hospital routes
router.post('/claim', protect, authorize('hospital'), createClaim);
router.get('/hospital-claims', protect, authorize('hospital'), getHospitalClaims);

// Admin routes
router.post('/', protect, authorize('admin'), createScheme);
router.get('/admin-claims', protect, authorize('admin'), getAdminClaims);
router.put('/claim/:id', protect, authorize('admin'), updateClaimStatus);

module.exports = router;
