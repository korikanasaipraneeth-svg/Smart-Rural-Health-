const express = require('express');
const multer = require('multer');
const { scanDocument } = require('../controllers/scanController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Setup Multer to store file in memory
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Protect route so only logged-in users can scan
router.post('/document', protect, upload.single('image'), scanDocument);

module.exports = router;
