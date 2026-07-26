// Unit Tests - This file tests the core authentication functions used in the login system:
// 1. Making sure passwords are stored securely by bcrypt password hashing;
// 2. JWT token generation and verification - making sure the session system works
// Vinicius Brito

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Setting up test environment variables to avoid using the real .env file
process.env.JWT_SECRET = 'certrack_test';
process.env.JWT_EXPIRES_IN = '8h';

// Testing bcrypt passwords
// bcrypt is used to hash passwords before saving them to the database
// These tests make sure the hashing and comparison functions work correctly

describe('Password Hashing (bcrypt)', () => {

// 1- Making sure bcrypt actually hashes the password so they are never the same
  test('expecting hashed password and returning a different string ', async () => {
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password); // it must be different from original password
  });

// 2-  Makeing sure a correct password matches its hash, simulating what happens when an admin logs in with the correct password
  test('should return true when comparing correct password with its hash', async () => {
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    const match = await bcrypt.compare(password, hash);
    expect(match).toBe(true); // correct password must match
  });

// 3-  Make sure a wrong password does NOT match the hash
  // This simulates what happens when someone tries to log in with the wrong password
  test('should return false when comparing wrong password with hash', async () => {
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    const match = await bcrypt.compare('wrongpassword', hash);
    expect(match).toBe(false);// wrong password
  });

});

// 4- JWT tests for making sure tokens are created and verified correct after login

describe('JWT Token (jsonwebtoken)', () => {

  test('should create a JWT token with user data', () => {
    const payload = { id: 1, name: 'Admin User', role: 'admin' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    expect(token).toBeDefined();// token must exist
    expect(typeof token).toBe('string'); //token must be a string
  });

//5-  Making sure the token contains the correct user data when decoded (middleware protecting routes)
  test('should decode JWT token and return correct user data', () => {
    const payload = { id: 1, name: 'Admin User', role: 'admin' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
     //ID, name and role must match
    expect(decoded.id).toBe(1);
    expect(decoded.name).toBe('Admin User');
    expect(decoded.role).toBe('admin');
  });

  // 6-  Making sure a token signed with a different secret is rejected, when security attack where someone tries to forge a token
  test('should throw an error when verifying token with wrong secret', () => {
    const payload = { id: 1, role: 'admin' };
    const token = jwt.sign(payload, 'wrong_secret'); // signed with wrong secret
    expect(() => jwt.verify(token, process.env.JWT_SECRET)).toThrow(); // must throw error
  });

});

// CertTrack specific tests
describe('Certificate Status Calculation (CertTrack)', () => {

  //7 -  Certificate expiry status calculation - calculating if a cert is valid, expiring or expired
  test('should return expired when expiry date has passed', () => {
    const today = new Date();
    const expiry = new Date('2020-01-01'); // past date
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    const status = daysUntilExpiry < 0 ? 'expired' : daysUntilExpiry <= 30 ? 'expiring_soon' : 'valid';
    expect(status).toBe('expired');
  });

  test('should return expiring_soon when expiry is within 30 days', () => {
    const today = new Date();
    const expiry = new Date(today.getTime() + (15 * 24 * 60 * 60 * 1000)); // 15 days from today
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    const status = daysUntilExpiry < 0 ? 'expired' : daysUntilExpiry <= 30 ? 'expiring_soon' : 'valid';
    expect(status).toBe('expiring_soon');
  });

  test('should return valid when expiry is more than 30 days away', () => {
    const today = new Date();
    const expiry = new Date(today.getTime() + (60 * 24 * 60 * 60 * 1000)); // 60 days from today
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    const status = daysUntilExpiry < 0 ? 'expired' : daysUntilExpiry <= 30 ? 'expiring_soon' : 'valid';
    expect(status).toBe('valid');
  });

});