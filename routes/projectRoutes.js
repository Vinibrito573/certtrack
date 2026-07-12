// Project routes file is responsible for managing all projects/ Construction sites
//All routes are protected for Admin access only
// Vinicius Brito

const express = require('express');
const router  = express.Router();

const projectController= require('../controllers/projectController');
const { isAuthenticated,isAdmin } =require('../middleware/authMiddleware');

// Displaying all construction projects/sites
router.get('/', isAuthenticated, isAdmin, projectController.index);

// Displaying form to add a new construction project/site
router.get('/create',isAuthenticated,isAdmin, projectController.showCreate);

// Sending new construction project name to the database
router.post('/create',isAuthenticated, isAdmin, projectController.create);

// Displaying form to edit an existing project
router.get('/edit/:id',isAuthenticated,isAdmin, projectController.showEdit);

// Sending updated project details to the database
router.post('/edit/:id',isAuthenticated,isAdmin, projectController.update);

// Removing a construction project from the system
router.post('/delete/:id',isAuthenticated, isAdmin, projectController.remove);

module.exports = router;