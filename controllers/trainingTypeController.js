// Training Type Controller file: It allows admins to manage training types directly from the system, without needing to access the database manually
// Vinicius Brito

const trainingTypeModel = require('../models/trainingTypeModel');

// Showing the list of all training types
const index = async (req, res) => {
  try {
    const trainingTypes = await trainingTypeModel.getAll();
    res.render('trainingTypes/index', {
      title: 'Training Types',
      trainingTypes,
      user: req.user
    });
  } catch (err) {
    console.error('Error fetching training types:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

// Showing the form to add a new training type
const showCreate = (req, res) => {
  res.render('trainingTypes/form', {
    title: 'Add Training Type',
    trainingType: null,
    user: req.user
  });
};

// Saving a new training type to the database
const create = async (req, res) => {
  const { name, validity_months, mandatory_default } = req.body;
  try {
    await trainingTypeModel.create(name, validity_months, mandatory_default === 'on');
    res.redirect('/training-types');
  } catch (err) {
    console.error('Error creating training type:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};
// Showing the form to edit an existing training type
const showEdit = async (req, res) => {
  try {
    const trainingType = await trainingTypeModel.getById(req.params.id);
    res.render('trainingTypes/form', {
      title: 'Edit Training Type',
      trainingType,
      user: req.user
    });
  } catch (err) {
    console.error('Error fetching training type:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

// Updating an existing training type in the database
const update = async (req, res) => {
  const { name, validity_months, mandatory_default } = req.body;
  try {
    await trainingTypeModel.update(req.params.id, name, validity_months, mandatory_default === 'on');
    res.redirect('/training-types');
  } catch (err) {
    console.error('Error updating training type:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

// Deleting a training type
const remove = async (req, res) => {
  try {
    await trainingTypeModel.remove(req.params.id);
    res.redirect('/training-types');
  } catch (err) {
    console.error('Error deleting training type:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};
module.exports = { index, showCreate, create, showEdit, update, remove };