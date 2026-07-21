// This file is responsible for managing all queries related to training certificates
// Vinicius Brito

const db = require('../config/db');

// Getting all certificates with employee/worker and training type details
const getAll = async () => {
  const [rows] = await db.query(`
    SELECT c.*, e.name AS employee_name, e.employee_ref,
           tt.name AS training_name, tt.validity_months
    FROM certificates c
    JOIN employees e ON c.employee_id = e.id
    JOIN training_types tt ON c.training_type_id = tt.id
    ORDER BY c.expiry_date ASC
  `);
  return rows;
};

// Getting all certificates for a specific worker
const getByEmployee = async (employeeId) => {
  const [rows] = await db.query(`
    SELECT c.*, tt.name AS training_name
    FROM certificates c
    JOIN training_types tt ON c.training_type_id = tt.id
    WHERE c.employee_id = ?
    ORDER BY c.expiry_date ASC
  `, [employeeId]);
  return rows;
};

// Saving a new certificate to the database
// Saving a new certificate to the database
const create = async (employeeId, trainingTypeId, issueDate, expiryDate, filePath, ocrRawText, uploadedBy, status) => {
  const [result] = await db.query(`
    INSERT INTO certificates 
    (employee_id, training_type_id, issue_date, expiry_date, file_path, ocr_raw_text, uploaded_by, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [employeeId, trainingTypeId, issueDate, expiryDate, filePath, ocrRawText, uploadedBy, status]);
  return result.insertId;
};

// Updating certificate status (valid, expiring_soon or expired)
const updateStatus = async (id, status) => {
  await db.query('UPDATE certificates SET status = ? WHERE id = ?', [status, id]);
};

// Deleting a certificate
const remove = async (id) => {
  await db.query('DELETE FROM certificates WHERE id = ?', [id]);
};

module.exports = { getAll, getByEmployee, create, updateStatus, remove };