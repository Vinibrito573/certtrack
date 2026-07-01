// This file we will be able to authenticate if the user is logged and giving a token to access the system, and also their role
// Vinicius Brito

const jwt = require('jsonwebtoken');

// Checking if the user is authenticated
const isAuthenticated = (req,res, next) => {
  const token = req.cookies?.token;

  // If the user tries to login, but the credential was not found, then redirect to login page
  if (!token) {
    return res.redirect('/login');
  }

  try {
    // Verifying the token using the secret from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // saving user info for use in controllers
    next();
  } catch (err) {
    // If token is invalid or expired, then
    return res.redirect('/login');
  }
};

// Checking if the logged in user is an admin, as admin has a special access
const isAdmin = (req, res, next) => {
  if(req.user?.role !== 'admin') {
    return res.status(403).send('Access denied - Admins only');
  }
  next();
};
module.exports = { isAuthenticated, isAdmin };