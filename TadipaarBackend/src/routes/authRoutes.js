const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const multer = require('multer');

// Configure Multer for better file naming (e.g., checkin_123456.jpg)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `checkin_${Date.now()}.jpg`)
});
const upload = multer({ storage: storage });

// Routes
router.post('/login', authController.login);
router.post('/register-officer', authController.registerOfficer);
router.post('/register-criminal', authController.registerCriminal);

// Criminal Check-in with Geotagged Image
// Note: We moved the logic to the controller for better organization
router.post('/check-in', upload.single('photo'), authController.handleCheckIn);

router.get('/criminals', authController.getAllCriminals);
router.get('/officers', authController.getAllOfficers);

module.exports = router;