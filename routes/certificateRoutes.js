//This file is responsible for managing the full certificate lifecycle for construction workers
// All routes are protected for admin access only, for security
// Vinicius Brito

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const certificateController = require('../controllers/certificateController');
const { isAuthenticated,isAdmin }= require('../middleware/authMiddleware');

// Setting where uploaded certificates will be stored via Multer
const storage = multer.diskStorage({ destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // saving files to public/uploads folder
  },
  filename: (req, file, cb) => {
    // creating a unique filename using timestamp to avoid duplicates
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Only allowing images and PDFs to be uploaded, so the OCR can work it out better
const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Displaying all certificates
router.get('/', isAuthenticated, isAdmin, certificateController.index);

// Displaying certificate upload form
router.get('/upload', isAuthenticated, isAdmin, certificateController.showUpload);

// Processing uploaded certificate with OCR
router.post('/upload', isAuthenticated, isAdmin, upload.single('certificate'), certificateController.processUpload);

// Saving confirmed certificate to the database
router.post('/save', isAuthenticated, isAdmin, certificateController.saveCertificate);

// Deleting a certificate
router.post('/delete/:id', isAuthenticated, isAdmin, certificateController.remove);

module.exports = router;