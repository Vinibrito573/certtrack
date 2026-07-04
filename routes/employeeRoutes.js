// Employee routes file is responsible for managing all workers registration and compliance tracking
//All routes are protected for Admin access only
// Vinicius Brito

const express = require('express');
const router  = express.Router();
const employeeController = require('../controllers/employeeController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Display all registered employee
router.get('/', isAuthenticated,isAdmin, employeeController.index);

// Showing form to add a new worker
router.get('/create', isAuthenticated, isAdmin, employeeController.showCreate);

// Saving a new worker details to the database
router.post('/create', isAuthenticated,isAdmin, employeeController.create);

// Showing form to edit an employee details
router.get('/edit/:id', isAuthenticated,isAdmin, employeeController.showEdit);

// Updating an employee in the database
router.post('/edit/:id', isAuthenticated,isAdmin, employeeController.update);

// Deleting an employee from the database
router.post('/delete/:id',isAuthenticated, isAdmin, employeeController.remove);

module.exports = router;