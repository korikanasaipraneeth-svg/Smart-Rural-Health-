const express = require('express');
const {
    updateBedAvailability,
    getEmergencyRequests,
    updateEmergencyStatus,
    createFakeEmergency,
    requestAmbulance,
    trackAmbulance
} = require('../controllers/emergencyController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/beds')
    .put(protect, authorize('hospital'), updateBedAvailability);

router.route('/requests')
    .get(protect, authorize('hospital'), getEmergencyRequests);

router.route('/requests/:id')
    .put(protect, authorize('hospital'), updateEmergencyStatus);

// [DEV ONLY] Route to generate fake emergencies
router.route('/fake')
    .post(protect, authorize('hospital'), createFakeEmergency);

router.post('/request-ambulance', protect, authorize('patient'), requestAmbulance);
router.get('/track/:id', protect, authorize('patient'), trackAmbulance);

module.exports = router;
