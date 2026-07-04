// The user model file will be responsible for handling all database queries related to employees (construction workers)
// Vinicius Brito

const db = require('../config/db'); // Connection to Database

// Getting all employees from the database
const getAll = async () => {const [rows] = await db.query ('SELECT * FROM employees ORDER BY name ASC');
  return rows;
};

// Getting a specific employee by ID
const getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);
  return rows[0];
};

// Adding a new employee
const create = async (name, employee_ref, email, company) => {
  const [result] = await db.query('INSERT INTO employees (name, employee_ref, email, company) VALUES (?, ?, ?, ?)',
    [name, employee_ref, email, company]
  );
  return result.insertId;
};

// Updating an existing employee
const update = async (id, name, employee_ref, email, company) => {
  await db.query('UPDATE employees SET name = ?, employee_ref = ?, email = ?, company = ? WHERE id = ?',
    [name, employee_ref, email, company, id]
  );
};

// Deleting an employee
const remove = async (id) => {
  await db.query('DELETE FROM employees WHERE id = ?', [id]);
};
module.exports = { getAll, getById, create, update, remove };