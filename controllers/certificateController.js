// This file controller is responsible for managing the full certification lifecycle;
// Lifecycle: Upload > OCR Processing > Admin review > Saving to the database;
// All routes are admin only, except the employee self-service view
// Vinicius Brito

const certificateModel =require('../models/certificateModel');
const { parseText } =require('../utils/ocrParser');
const db = require('../config/db');

// Loading the upload from with all workers and training types
const showUpload = async (req, res) => {
  try {
    // Getting all employees and training types for the form dropdowns
    const [employees] = await db.query('SELECT id, name, employee_ref FROM employees ORDER BY name ASC');
    const [trainingTypes]= await db.query('SELECT * FROM training_types ORDER BY name ASC');
    res.render('certificates/upload',{
      title: 'Upload Certificate',
      employees,
      trainingTypes,
      user: req.user
    });
  } catch (err){
    console.error('Error loading upload form:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

// Processing the uploaded certificate with OCR
const processUpload = async (req, res) => {
  try {
    // Getting the uploaded file path
    const filePath = req.file.path;

    // Running OCR on the uploaded certificate
    const rawText = await parseText(filePath);

    // Getting employees and training types for the review form
    const [employees] = await db.query('SELECT id, name, employee_ref FROM employees ORDER BY name ASC');
    const [trainingTypes] = await db.query('SELECT * FROM training_types ORDER BY name ASC');

    // Trying to automatically identify the training type from the OCR text
    let selectedTraining = req.body.training_type_id || null;
    if (!selectedTraining) {
      for (const tt of trainingTypes) {
        if (rawText.toLowerCase().includes(tt.name.toLowerCase())) {
          selectedTraining = tt.id;
          break;
        }
      }
    }

    // Sending OCR results to admin for review before saving
    res.render('certificates/review', {
      title: 'Review Certificate',
      rawText,
      filePath,
      employees,
      trainingTypes,
      user: req.user,
      selectedEmployee: req.body.employee_id,
      selectedTraining,
    });
  } catch (err) {
    console.error('Error processing certificate:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

// Saving the confirmed certificate to the database
const saveCertificate = async (req, res) => {
  const { employee_id, training_type_id, issue_date, expiry_date, file_path, ocr_raw_text } = req.body;
  try {
    // Calculating the certificate status based on expiry date
    const today = new Date();
    const expiry = new Date(expiry_date);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    let status;
    if (daysUntilExpiry < 0) {
      status = 'expired';
    } else if (daysUntilExpiry <= 30) {
      status = 'expiring_soon';
    } else {
      status = 'valid';
    }

    await certificateModel.create(
      employee_id, training_type_id, issue_date,
      expiry_date, file_path, ocr_raw_text, req.user.id, status
    );
    res.redirect('/certificates');
  } catch (err) {
    console.error('Error saving certificate:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

// Displaying all certificates from all employees and organising by expiry date so the most urgent ones appear first
const index = async (req, res) => {
  try {
    const certificates = await certificateModel.getAll();
    res.render('certificates/index', {
      title: 'Certificates',
      certificates,
      user: req.user
    });

  } catch (err) {
    console.error('Error fetching certificates:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

// Deleting a certificate
const remove = async (req, res) => {
  try {
    await certificateModel.remove(req.params.id);
    res.redirect('/certificates');
  } catch (err) {
    console.error('Error deleting certificate:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

module.exports = { showUpload, processUpload, saveCertificate, index, remove };