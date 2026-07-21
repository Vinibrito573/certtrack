// Export Controller file, Handles CSV export of all training certificates for Excel analysis
// Vinicius Brito

const { createObjectCsvWriter } = require('csv-writer');
const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// Exporting all certificates to CSV
const exportCSV = async (req, res) => {
  try {
    // Getting all certificates with worker and training type details
    const [certificates] = await db.query(`
      SELECT 
        e.name AS worker_name,
        e.employee_ref AS worker_id,
        e.company,
        tt.name AS training_type,
        DATE_FORMAT(c.issue_date, '%d/%m/%Y') AS issue_date,
        DATE_FORMAT(c.expiry_date, '%d/%m/%Y') AS expiry_date,
        c.status
      FROM certificates c
      JOIN employees e ON c.employee_id = e.id
      JOIN training_types tt ON c.training_type_id = tt.id
      ORDER BY e.name ASC, c.expiry_date ASC
    `);

    // Setting the CSV file path
    const filePath = path.join(__dirname, '../public/exports/training_matrix.csv');

    // Creating the exports folder if it does not exist
    const exportsDir = path.join(__dirname, '../public/exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Creating the CSV writer with column headers
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'worker_name', title: 'Full Name' },
        { id: 'worker_id', title: 'Worker ID' },
        { id: 'company', title: 'Company' },
        { id: 'training_type', title: 'Training Type' },
        { id: 'issue_date', title: 'Issue Date' },
        { id: 'expiry_date', title: 'Expiry Date' },
        { id: 'status', title: 'Status' },
      ]
    });

    // Writing the certificates to the CSV file
    await csvWriter.writeRecords(certificates);

    // Sending the CSV file to the browser for download
    res.download(filePath, 'CertTrack_Training_Matrix.csv', (err) => {
      if (err) console.error('Error downloading CSV:', err);
      // Removing the file after download
      fs.unlinkSync(filePath);
    });

  } catch (err) {
    console.error('Error exporting CSV:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

module.exports = { exportCSV };