/**
 * server/controllers/contactController.js
 * Controller handling contact form API endpoints using MVC structure.
 */

const { validationResult } = require('express-validator');
const ContactModel = require('../models/contactModel');
const { sendOwnerNotification, sendVisitorThankYou } = require('../utils/mailService');

/**
 * @desc    Submit new contact form message
 * @route   POST /api/contact
 * @access  Public
 */
const submitContact = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array().map(err => err.msg)
            });
        }

        const { name, email, subject, message } = req.body;

        // Save to MySQL database
        const newContact = await ContactModel.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim()
        });

        // Send email notifications asynchronously (non-blocking for UI speed)
        Promise.allSettled([
            sendOwnerNotification({ name, email, subject, message }),
            sendVisitorThankYou({ name, email })
        ]).catch(err => console.error('Email task error:', err));

        return res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully!',
            data: newContact
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all contact messages (newest first, paginated)
 * @route   GET /api/contact
 * @access  Public (Admin)
 */
const getAllContacts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, email = null } = req.query;
        const result = await ContactModel.findAll({ page, limit, email });

        return res.status(200).json({
            success: true,
            data: result.contacts,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single contact message by ID
 * @route   GET /api/contact/:id
 * @access  Public (Admin)
 */
const getContactById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid message ID format'
            });
        }

        const contact = await ContactModel.findById(id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete contact message by ID
 * @route   DELETE /api/contact/:id
 * @access  Public (Admin)
 */
const deleteContact = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid message ID format'
            });
        }

        const deleted = await ContactModel.deleteById(id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Message not found or already deleted'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    submitContact,
    getAllContacts,
    getContactById,
    deleteContact
};
