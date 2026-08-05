const express = require('express');
const { 
    registerHospital, 
    getApprovedHospitals, 
    getPendingHospitals, 
    approveHospital,
    getHospitalProfile,
    updateHospitalProfile,
    uploadHospitalLogo,
    uploadHospitalCover,
    getHospitalAppointments,
    updateAppointmentStatus
} = require('../controllers/hospitalController');
const { getDistrictInventory, updateInventory, getHospitalBloodRequests, updateBloodRequestStatus } = require('../controllers/bloodBankController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const router = express.Router();

router.post('/', registerHospital);
router.get('/public', getApprovedHospitals);

// Hospital profile routes (Requires 'hospital' role)
router.route('/profile')
    .get(protect, authorize('hospital'), getHospitalProfile)
    .put(protect, authorize('hospital'), updateHospitalProfile);

router.post('/upload/logo', protect, authorize('hospital'), upload.single('logo'), uploadHospitalLogo);
router.post('/upload/cover', protect, authorize('hospital'), upload.single('coverImage'), uploadHospitalCover);

// Admin only routes
router.get('/pending', protect, authorize('admin'), getPendingHospitals);
router.put('/:id/approve', protect, authorize('admin'), approveHospital);

// Appointments
router.route('/appointments')
    .get(protect, authorize('hospital'), getHospitalAppointments);

router.route('/appointments/:id')
    .put(protect, authorize('hospital'), updateAppointmentStatus);

// Blood Bank
router.route('/blood-bank')
    .get(protect, authorize('hospital'), getDistrictInventory)
    .put(protect, authorize('hospital'), updateInventory);

router.route('/blood-bank/requests')
    .get(protect, authorize('hospital'), getHospitalBloodRequests);

router.route('/blood-bank/requests/:id')
    .put(protect, authorize('hospital'), updateBloodRequestStatus);

module.exports = router;
