/**
 * server/routes/contactRoutes.js
 * Express router for contact API endpoints with express-validator validation rules.
 */

const express = require('express');
const { body } = require('express-validator');
const {
    submitContact,
    getAllContacts,
    getContactById,
    deleteContact
} = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Validation rules for POST /api/contact
const contactValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required.')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail(),
    body('subject')
        .trim()
        .notEmpty().withMessage('Subject is required.')
        .isLength({ min: 3, max: 200 }).withMessage('Subject must be between 3 and 200 characters.'),
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required.')
        .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters.')
];

// POST /api/contact - Submit contact form with rate limiting & validation
router.post('/', contactLimiter, contactValidationRules, submitContact);

// GET /api/contact - Get all contact messages
router.get('/', getAllContacts);

// GET /api/contact/:id - Get single contact message
router.get('/:id', getContactById);

// DELETE /api/contact/:id - Delete contact message
router.delete('/:id', deleteContact);

module.exports = router;
