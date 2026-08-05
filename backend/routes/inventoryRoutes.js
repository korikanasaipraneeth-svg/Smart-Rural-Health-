const express = require('express');
const {
    getInventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    runPredictions,
    getTransfers,
    updateTransferStatus
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/predict', runPredictions); // Needs to be accessible by Admin or Hospital. Since this router is later protected by authorize('hospital'), wait, we need it to be accessible by both.
// Wait, router.use(authorize('hospital')) restricts everything. Let's put /predict before the restrict or just remove authorize('hospital') from router.use and add it to individual routes.

router.route('/transfers')
    .get(authorize('admin', 'hospital_admin'), getTransfers);

router.route('/transfers/:id')
    .put(authorize('admin'), updateTransferStatus);

router.route('/')
    .get(authorize('hospital_admin', 'admin'), getInventory)
    .post(authorize('hospital_admin'), addInventoryItem);

router.route('/:id')
    .put(authorize('hospital_admin'), updateInventoryItem)
    .delete(authorize('hospital_admin'), deleteInventoryItem);

module.exports = router;
