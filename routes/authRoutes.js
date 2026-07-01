// Authentication routes for CertTrack
// Mananing the login and logout
// Vinicius Brito

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Showing the login page for user
router.get('/login',authController.showLogin);

// Working on the login form submission
router.post('/login',authController.login);

// Handling logout
router.get('/logout',authController.logout);

// Redirecting root to login
router.get('/',(req, res) => res.redirect('/login'));

module.exports = router;