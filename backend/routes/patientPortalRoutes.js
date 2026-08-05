const express = require('express');
const { 
    getPatientProfile,
    updatePatientProfile,
    getPatientRecords,
    getPatientAppointments,
    bookAppointment,
    getHospitalsForBooking,
    getDoctorsForBooking,
    getBloodBankNetwork,
    getPatientBloodRequests,
    createBloodRequest
} = require('../controllers/patientPortalController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/profile')
    .get(protect, authorize('patient'), getPatientProfile)
    .put(protect, authorize('patient'), updatePatientProfile);

router.route('/records')
    .get(protect, authorize('patient'), getPatientRecords);

router.route('/appointments')
    .get(protect, authorize('patient'), getPatientAppointments)
    .post(protect, authorize('patient'), bookAppointment);

router.get('/hospitals', protect, authorize('patient'), getHospitalsForBooking);
router.get('/doctors/:hospitalId', protect, authorize('patient'), getDoctorsForBooking);

// Blood Bank routes
router.get('/blood-bank', protect, authorize('patient'), getBloodBankNetwork);
router.route('/blood-bank/requests')
    .get(protect, authorize('patient'), getPatientBloodRequests)
    .post(protect, authorize('patient'), createBloodRequest);

module.exports = router;
