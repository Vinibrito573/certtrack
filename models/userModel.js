// The user model file will be responsible for handling all database requests from the users (Workers and Admins)
// Vinicius Brito

const db = require('../config/db');

// Finding the user by email (which was used for login)
const findByEmail = async (email) => {const [rows] = await db.query
    ('SELECT * FROM users WHERE email = ?',[email]
    );
    return rows[0]; // returning the first result or not found
};

// Finding a user by ID
const findById = async (id) => {const [rows] = await db.query
    ('SELECT * FROM users WHERE id = ?',[id]

    );
    return rows[0];
};

// Creating a new user (admin registration)
const createUser = async (name, email, passwordHash, role, employeeId = null) => {
    const [result] = await db.query(
    'INSERT INTO users (name, email, password_hash, role, employee_id) VALUES (?, ?, ?, ?, ?)',
    [name, email, passwordHash, role, employeeId]
    );
    return result.insertId; // returning the new user ID
};
module.exports = { findByEmail, findById, createUser };