// Project Controller is responsible for handling all logic for managing construction sites/projects
// Vinicius Brito

const projectModel = require('../models/projectModel');

// Showing the list of all projects
const index = async (req, res) => {
  try {
    const projects = await projectModel.getAll();
    res.render('projects/index', { title: 'Projects', projects, user: req.user });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

// Showing the form to add a new project
const showCreate = (req, res) => {
  res.render('projects/form', { title: 'Add Project', project: null, user: req.user });
};

// Saving a new project to the database
const create = async (req, res) => {
  const { name, location, status } = req.body;
  try {
    await projectModel.create(name, location, status);
    res.redirect('/projects');
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

// Showing the form to edit an existing project
const showEdit = async (req, res) => {
  try {
    const project = await projectModel.getById(req.params.id);
    res.render('projects/form', { title: 'Edit Project', project, user: req.user });
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

// Updating an existing project in the database
const update = async (req, res) => {
  const { name, location, status } = req.body;
  try {
    await projectModel.update(req.params.id, name, location, status);
    res.redirect('/projects');
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

// Deleting a project from the database
const remove = async (req, res) => {
  try {
    await projectModel.remove(req.params.id);
    res.redirect('/projects');
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

module.exports = { index, showCreate, create, showEdit, update, remove };