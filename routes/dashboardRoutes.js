// In this file will be given the dashboard routes for CertTrack
// Displays compliance KPIs and project overview
// Vinicius Brito

const express = require('express');
const router  = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Show dashboard page, which only admins can access
router.get('/', isAuthenticated, isAdmin, (req, res) => {res.render('dashboard/index', { 
    title: 'Dashboard',
    user: req.user,
    stats: { valid: 0, expiring: 0, expired: 0 } // placeholder for now
  });
});

module.exports = router;