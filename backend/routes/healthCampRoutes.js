const express = require('express');
const router = express.Router();
const {
    createCamp,
    getHospitalCamps,
    getAllCamps,
    updateCamp,
    registerForCamp,
    getMyRegistrations,
    getCampRegistrations,
    updateRegistrationStatus
} = require('../controllers/healthCampController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public or Patient/Admin routes
router.route('/')
    .get(protect, getAllCamps) // Everyone can see camps
    .post(protect, authorize('hospital'), createCamp); // Only hospitals create

// Patient routes
router.get('/my-registrations', protect, authorize('patient'), getMyRegistrations);
router.post('/:id/register', protect, authorize('patient'), registerForCamp);

// Hospital routes
router.get('/hospital', protect, authorize('hospital'), getHospitalCamps);
router.get('/:id/registrations', protect, authorize('hospital'), getCampRegistrations);
router.put('/registrations/:regId', protect, authorize('hospital'), updateRegistrationStatus);

// Admin / Hospital updates (e.g. status changes)
router.put('/:id', protect, authorize('admin', 'hospital'), updateCamp);

module.exports = router;
