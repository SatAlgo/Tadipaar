const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ensure these function names exist in authController.js
router.post('/login', authController.login);
router.post('/register-officer', authController.registerOfficer);
router.post('/register-criminal', authController.registerCriminal);

router.get('/criminals', authController.getAllCriminals);
router.get('/officers', authController.getAllOfficers);

module.exports = router;