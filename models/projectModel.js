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

// Getting all workers assigned to a specific project with their certificates
const getWorkersWithCertificates = async (projectId) => {
  const [rows] = await db.query(`
    SELECT 
      e.id, e.name, e.employee_ref, e.company,
      c.id AS cert_id, tt.name AS training_name,
      c.expiry_date, c.status
    FROM project_employees pe
    JOIN employees e ON pe.employee_id = e.id
    LEFT JOIN certificates c ON c.employee_id = e.id
    LEFT JOIN training_types tt ON c.training_type_id = tt.id
    WHERE pe.project_id = ?
    ORDER BY e.name ASC, c.expiry_date ASC
  `, [projectId]);
  return rows;
};

// Getting all employees not yet assigned to a specific project
const getUnassignedEmployees = async (projectId) => {
  const [rows] = await db.query(`
    SELECT e.id, e.name, e.employee_ref, e.company
    FROM employees e
    WHERE e.id NOT IN (
      SELECT employee_id FROM project_employees WHERE project_id = ?
    )
    ORDER BY e.name ASC
  `, [projectId]);
  return rows;
};

// Assigning a worker to a project
const assignWorker = async (projectId, employeeId) => {
  await db.query(
    'INSERT INTO project_employees (project_id, employee_id) VALUES (?, ?)',
    [projectId, employeeId]
  );
};

// Removing a worker from a project
const removeWorker = async (projectId, employeeId) => {
  await db.query(
    'DELETE FROM project_employees WHERE project_id = ? AND employee_id = ?',
    [projectId, employeeId]
  );
};

module.exports = { getAll, getById, create, update, remove, getWorkersWithCertificates, getUnassignedEmployees, assignWorker, removeWorker };