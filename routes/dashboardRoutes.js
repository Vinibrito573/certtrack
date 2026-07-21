// In this file will be given the dashboard routes for CertTrack
// Displays compliance KPIs and project overview
// Vinicius Brito

const express = require('express');
const router  = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Loading the main compliance dashboard
router.get('/', isAuthenticated, isAdmin, dashboardController.index);

module.exports = router;