const express = require('express');
const {
    getPatients, addPatient, updatePatient, deletePatient,
    getDoctors, addDoctor, updateDoctor, deleteDoctor,
    getHospitals, addHospital, updateHospital, deleteHospital,
    getDiseases, addDisease, updateDisease, deleteDisease,
    getFeedback, addFeedback, updateFeedback, deleteFeedback,
    getStats,
    getBloodBankNetwork, getAllBloodRequests
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(protect);
router.use(authorize('admin'));

router.route('/patients')
    .get(getPatients)
    .post(addPatient);
router.route('/patients/:id')
    .put(updatePatient)
    .delete(deletePatient);

router.route('/doctors')
    .get(getDoctors)
    .post(addDoctor);
router.route('/doctors/:id')
    .put(updateDoctor)
    .delete(deleteDoctor);

router.route('/hospitals')
    .get(getHospitals)
    .post(addHospital);
router.route('/hospitals/:id')
    .put(updateHospital)
    .delete(deleteHospital);

router.route('/diseases')
    .get(getDiseases)
    .post(addDisease);
router.route('/diseases/:id')
    .put(updateDisease)
    .delete(deleteDisease);

router.route('/feedback')
    .get(getFeedback)
    .post(addFeedback);
router.route('/feedback/:id')
    .put(updateFeedback)
    .delete(deleteFeedback);

router.route('/stats').get(getStats);

// Blood Bank routes for admin
router.get('/blood-bank', getBloodBankNetwork);
router.get('/blood-bank/requests', getAllBloodRequests);

module.exports = router;
