const express = require('express');
const {
    getHospitalPatients,
    getPatientDetails,
    admitPatient,
    updatePatientStatus
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Only hospitals can manage patients in this phase
router.route('/')
    .get(protect, authorize('hospital'), getHospitalPatients);

router.route('/admit')
    .post(protect, authorize('hospital'), admitPatient);

router.route('/:id')
    .get(protect, authorize('hospital'), getPatientDetails);

router.route('/:id/status')
    .put(protect, authorize('hospital'), updatePatientStatus);

module.exports = router;
