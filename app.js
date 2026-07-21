//STARTING MAIN APP FOR CERTTRACK APPLICATION
//Vinicius Brito
//JavaScript 25.06.2026

// Loading environment variables from .env file
require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

// Viewing engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));// parse form data
app.use(express.json());// parse JSON body
app.use(cookieParser());// parse cookies (JWT)
app.use(express.static(path.join(__dirname, 'public'))); // serve static files

// Routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const projectRoutes = require('./routes/projectRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const myCertificatesRoutes = require('./routes/myCertificatesRoutes');

app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/employees', employeeRoutes);
app.use('/projects', projectRoutes);
app.use('/certificates', certificateRoutes);
app.use('/my-certificates', myCertificatesRoutes);

// 404 error handling
app.use((req, res) => {res.status(404).send('Page not found');
});

//Starting Server
const PORT = process.env.PORT || 3000; //port
app.listen(PORT, () => { console.log(`CertTrack running on http://localhost:${PORT}`);
});