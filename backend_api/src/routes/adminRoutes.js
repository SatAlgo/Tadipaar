const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyPolice } = require('../middleware/authMiddleware');

router.post(
    '/create-externed',
    verifyToken,
    verifyPolice,
    adminController.createExternedPerson
);

module.exports = router;