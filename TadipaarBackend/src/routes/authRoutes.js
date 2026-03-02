const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// CRITICAL FIX: Use a wrapper to ensure no 'TypeError' during the demo
const routeHandler = (fn) => {
    return (req, res, next) => {
        if (!fn) {
            console.error("CRITICAL: A route handler is missing in the controller!");
            return res.status(500).json({ error: "Backend handler not found" });
        }
        fn(req, res, next);
    };
};

router.post('/login', routeHandler(authController.login));
router.post('/register-officer', routeHandler(authController.registerOfficer));
router.post('/register-criminal', routeHandler(authController.registerCriminal));
router.get('/criminals', routeHandler(authController.getAllCriminals));
router.post('/check-in', upload.single('photo'), routeHandler(authController.handleCheckIn));

module.exports = router;