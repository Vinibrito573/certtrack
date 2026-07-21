// Dashboard Controller file to get real compliance data from the database to display on the dashboard
// Showing total valid, expiring soon and expired certificates across all projects
// Vinicius Brito

const db = require('../config/db');

// Loading the compliance dashboard with real data from the database
const index = async (req, res) =>{
  try {
    // Counting valid certificates (expiry date is more than 30 days away)
    const [valid] = await db.query(`
      SELECT COUNT(*) AS total FROM certificates
      WHERE expiry_date > DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    `);

    // Counting expiring soon certificates (expiry date is within the next 30 days)
    const [expiring] = await db.query(`
      SELECT COUNT(*) AS total FROM certificates
      WHERE expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    `);

    // Counting expired certificates (expiry date has already passed)
    const [expired] = await db.query(`
      SELECT COUNT(*) AS total FROM certificates
      WHERE expiry_date < CURDATE()
    `);

    // Getting the 5 most urgent certificates expiring soon for the dashboard table
    const [urgentCerts] = await db.query(`
      SELECT c.expiry_date, e.name AS employee_name, e.employee_ref,
             tt.name AS training_name
      FROM certificates c
      JOIN employees e ON c.employee_id = e.id
      JOIN training_types tt ON c.training_type_id = tt.id
      WHERE c.expiry_date >= CURDATE()
      ORDER BY c.expiry_date ASC
      LIMIT 5
    `);

    res.render('dashboard/index', {
      title: 'Dashboard',
      user: req.user,
      stats: {
        valid: valid[0].total,
        expiring: expiring[0].total,
        expired: expired[0].total
      },
      urgentCerts
    });

  } catch (err) {
    console.error('Error loading dashboard:', err);
    res.status(500).send('Ops...Something went wrong, try again.');
  }
};

module.exports = { index };