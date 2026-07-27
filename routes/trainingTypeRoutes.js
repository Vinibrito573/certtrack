//Training Type Routes file: This file allows admins to manage training types directly from the system / Admin access only
// Vinicius Brito

const express = require('express');
const router  = express.Router();
const trainingTypeController = require('../controllers/trainingTypeController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Displaying all training types
router.get('/', isAuthenticated, isAdmin, trainingTypeController.index);

// Displaying form to add a new training type
router.get('/create', isAuthenticated, isAdmin, trainingTypeController.showCreate);

// Saving a new training type to the database
router.post('/create', isAuthenticated, isAdmin, trainingTypeController.create);

// Displaying form to edit a training type
router.get('/edit/:id', isAuthenticated, isAdmin, trainingTypeController.showEdit);

// Updating a training type in the database
router.post('/edit/:id', isAuthenticated, isAdmin, trainingTypeController.update);

// Deleting a training type
router.post('/delete/:id', isAuthenticated, isAdmin, trainingTypeController.remove);

module.exports = router;