// Employee controller file for handling all logic for managing construction workers
// Vinicius Brito

const employeeModel = require('../models/employeeModel');

// Showing the list of all employees
const index = async(req, res) =>{
  try {const employees = await employeeModel.getAll();
    res.render('employees/index',{ title: 'Employees', employees, user: req.user });
  } catch (err) { //if some error happens loading 
    console.error('Error fetching employees:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

// Showing the form to add a new employee
const showCreate = (req, res) =>{
  res.render('employees/form', { title: 'Add Employee', employee: null, user: req.user });
};

// Saving a new employee to the database
const create = async (req, res) => {
  const { name, email, company } = req.body;
  try {
    await employeeModel.create(name, email, company);
    res.redirect('/employees');
  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

// Showing the form to edit an existing employee
const showEdit = async (req,res) => {
  try {const employee = await employeeModel.getById(req.params.id);
    res.render('employees/form', { title: 'Edit Employee', employee, user: req.user });
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

// Updating an existing employee in the database
const update = async (req, res) => {
  const { name, email, company } = req.body; // employee_ref is not updated
  try {
    await employeeModel.update(req.params.id, name, email, company);
    res.redirect('/employees');
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

// Deleting an employee from the database
const remove = async (req, res) =>{
  try {await employeeModel.remove(req.params.id);
    res.redirect('/employees');
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).send('Ops...Something went wrong, try again');
  }
};

module.exports = { index, showCreate, create, showEdit, update, remove };