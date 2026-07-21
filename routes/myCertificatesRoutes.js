// My Certificates Routes file: Employee self-service portal, employees can only see their own certificates
// Vinicius Brito

const express = require('express');
const router  = express.Router();
const myCertificatesController = require('../controllers/myCertificatesController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Loading the employee self-service portal
// isAuthenticated only for security (employees do not need admin role to access this)
router.get('/', isAuthenticated, myCertificatesController.index);

module.exports = router;