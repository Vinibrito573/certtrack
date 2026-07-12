// Auth controller handling the login and logout logic
//Vinicius Brito

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel =require('../models/userModel');

// Showing login page
const showLogin = (req, res) =>{res.render('auth/login',{ error: null });
};

//Handling login form submission
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
    // Checking if user exists in the database
    const user = await userModel.findByEmail(email);
    if (!user) {return res.render('auth/login', { error: 'Invalid email or password' });
    }

    // Checking the password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {return res.render('auth/login', { error: 'Invalid email or password' });
    }

    // Creating a JWT token with user info
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role, employee_id: user.employee_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Saving a token in a cookie
    res.cookie('token', token, {
      httpOnly: true, // blocking the token access via JS for security reasons
      maxAge: 8 * 60 * 60 * 1000 // token will last for 8 hours in milliseconds
    });

    // Redirecting user based their role
    if (user.role === 'admin') {return res.redirect('/dashboard');} 
    else {
    return res.redirect('/my-certificates');
    }
    } catch (err) {console.error('Login error:', err);
    return res.render('auth/login', {error: 'Ops...Something went wrong, try again.' }); //showing message
  }
};

// Handling logout
const logout = (req, res) => {
  res.clearCookie('token'); // clearing the JWT cookie
  res.redirect('/login');
};

module.exports = { showLogin, login, logout };