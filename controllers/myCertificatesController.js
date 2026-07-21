// My Certificates Controller file will be responsible for handling the employee self-service portal,
// Where the workers can log in and view their own certificates and compliance status
// Vinicius Brito

const certificateModel = require('../models/certificateModel');

// Loading the employee self-service portal with their own certificates
const index = async (req, res) => {
  try {
    // Getting certificates only for the logged in employee
    const certificates = await certificateModel.getByEmployee(req.user.employee_id);

    res.render('myCertificates/index', {
      title: 'My Certificates',
      user: req.user,
      certificates
    });

  } catch (err) {
    console.error('Error loading my certificates:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

module.exports = { index };