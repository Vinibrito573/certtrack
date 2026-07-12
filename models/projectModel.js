//Project Model is responsible for handling all database queries related to construction projects/sites.
// Vinicius Brito


const db = require('../config/db');

// Getting all projects from the database
const getAll = async () => {const[rows]= await db.query('SELECT * FROM projects ORDER BY name ASC');
  return rows;
};

//Getting a single Site Construction by ID
const getById = async (id) => {const[rows]= await db.query('SELECT * FROM projects WHERE id = ?', [id]);
  return rows[0];
};

//Creating a new project
const create = async (name, location, status)=>{const [result] = await db.query('INSERT INTO projects (name, location, status) VALUES (?, ?, ?)',
    [name, location, status]
  );
  return result.insertId;
};

// Updating an existing project
const update = async (id, name, location, status) => {
  await db.query(
    'UPDATE projects SET name = ?, location = ?, status = ? WHERE id = ?',
    [name, location, status, id]
  );
};

// Deleting a project
const remove = async (id) => {await db.query('DELETE FROM projects WHERE id = ?', [id]);
};

module.exports = { getAll, getById, create, update, remove };