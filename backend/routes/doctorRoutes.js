const express = require('express');
const {
    getDoctors,
    getDoctorById,
    addDoctor,
    updateDoctor,
    deleteDoctor
} = require('../controllers/doctorController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Only hospitals can manage doctors in this phase
router.route('/')
    .get(protect, authorize('hospital'), getDoctors)
    .post(protect, authorize('hospital'), addDoctor);

router.route('/:id')
    .get(protect, authorize('hospital'), getDoctorById)
    .put(protect, authorize('hospital'), updateDoctor)
    .delete(protect, authorize('hospital'), deleteDoctor);

module.exports = router;
