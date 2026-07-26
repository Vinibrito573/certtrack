# Project NCI - Higher Diploma in Science in Computing (Software Development)
# CertTrack — Training Compliance Management System for Site Construction
# Vinicius Brito

CertTrack is a full-stack web application to manage employee training compliance on Irish construction sites, it was built with Node.js, Express, MySQL and Bootstrap 5.

## Features

- Admin login with JWT authentication and bcrypt password hashing
- Employee registration with auto-generated Worker ID
- Construction project management
- Certificate upload with OCR text extraction (JPG, PNG, PDF supported)
- Auto-identification of training type from OCR text
- Auto-fill of issue and expiry dates from OCR text
- Compliance dashboard with real-time KPIs (Valid / Expiring Soon / Expired)
- Employee self-service portal to view own certificates
- CSV export of full Training Matrix for Excel analysis
- Role-based access control (Admin and Employee)

## Tech Stack

- **Frontend:** HTML5, CSS3, Bootstrap 5, JavaScript (ES6), EJS
- **Backend:** Node.js, Express.js (REST API / MVC)
- **Database:** MySQL 8 — normalised schema (3NF)
- **OCR:** Tesseract.js + ImageMagick (PDF support)
- **Auth:** bcrypt + JWT
- **Testing:** Jest

## Requirements

Before running the project, please make sure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MySQL](https://www.mysql.com/) (v8 or higher)
- [ImageMagick](https://imagemagick.org/) — required for PDF certificate support

### Install ImageMagick (Mac)
```bash
brew install imagemagick ghostscript
```

### Install ImageMagick (Windows)
Download from: https://imagemagick.org/script/download.php

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/Vinibrito573/certtrack.git
cd certtrack
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up the database
- Open MySQL Workbench
- Create a new database called `certtrack`
- Run the file `database.sql` to create all tables and insert test data

### 4. Configure environment variables
Create a `.env` file in the root of the project:
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=certtrack
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=8h
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM=CertTrack your_email@gmail.com

### 5. Run the application
```bash
npm run dev
```
Open your browser and go to: http://localhost:3000

---

## Test Profiles (according to role criteria)

Admin: admin@certtrack.com (admin123)
Employee: josh@certtrack.com (worker123)

---

## Running Tests
```bash
npm test
```

---

## Project Structure:
certtrack/
├── config/ # Database connection
├── controllers/ # Route logic (MVC)
├── middleware/ # JWT authentication middleware
├── models/ # Database queries
├── public/ # Static files (CSS, JS, uploads)
├── routes/ # URL routes
├── tests/ # Jest unit tests
├── utils/ # OCR parser, mailer, alert job
├── views/ # EJS templates
├── app.js # Entry point
└── .env # Environment variables (not in GitHub)