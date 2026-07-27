// Training Type Model file: It handles all database queries related to training types
// Admins can add new training types directly from the system
// Vinicius Brito

const db = require('../config/db');

// Getting all training types from the database
const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM training_types ORDER BY name ASC');
  return rows;
};

// Getting a single training type by ID
const getById = async (id) => {
  const [rows]= await db.query('SELECT * FROM training_types WHERE id = ?', [id]);
  return rows[0];
};

// Creating a new training type
const create = async (name, validity_months, mandatory_default) => {
  const [result] = await db.query(
    'INSERT INTO training_types (name, validity_months, mandatory_default) VALUES (?, ?, ?)',
    [name, validity_months, mandatory_default]
  );
  return result.insertId;
};

// Updating an existing training type
const update = async (id, name, validity_months, mandatory_default) => {
  await db.query(
    'UPDATE training_types SET name = ?, validity_months = ?, mandatory_default = ? WHERE id = ?',
    [name, validity_months, mandatory_default, id]
  );
};

// Deleting a training type
const remove = async (id) => {
  await db.query('DELETE FROM training_types WHERE id = ?', [id]);
};
module.exports = { getAll, getById, create, update, remove };