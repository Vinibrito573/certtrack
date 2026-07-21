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

// Creating a new employee with auto-generated Worker ID (CT001, CT002, etc.), as we will have subcontractors and probably they wont have HR ID.

const create = async (name, email, company) => {
  // Counting existing employees to generate the next unique ID
  const [rows] = await db.query('SELECT COUNT(*) AS total FROM employees');
  const total = rows[0].total + 1;

  // Generating unique Worker ID // CT001, CT002, CT003...
  const employee_ref = 'CT' + String(total).padStart(3, '0');

  const [result] = await db.query(
    'INSERT INTO employees (name, employee_ref, email, company) VALUES (?, ?, ?, ?)',
    [name, employee_ref, email, company]
  );
  return result.insertId;
};

// Updating an existing employee
const update = async (id,name,email,company) => {
  await db.query(
    'UPDATE employees SET name = ?, email = ?, company = ? WHERE id = ?',
    [name,email,company, id]
  );
};

// Deleting an employee
const remove = async (id) => {
  await db.query('DELETE FROM employees WHERE id = ?', [id]);
};
module.exports = { getAll, getById, create, update, remove };