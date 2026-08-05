/**
 * server/models/contactModel.js
 * Model layer for managing MySQL queries related to the contacts table.
 */

const db = require('../config/db');

class ContactModel {
    /**
     * Create a new contact message record
     * @param {Object} data - { name, email, subject, message }
     * @returns {Promise<Object>} Created message with insertId
     */
    static async create({ name, email, subject, message }) {
        const sql = `
            INSERT INTO contacts (name, email, subject, message)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [name, email, subject, message]);
        return {
            id: result.insertId,
            name,
            email,
            subject,
            message,
            created_at: new Date()
        };
    }

    /**
     * Retrieve all contact messages ordered by newest first
     * Supports optional search by email and pagination
     * @param {Object} options - { page, limit, email }
     * @returns {Promise<Object>} Contacts list and pagination metadata
     */
    static async findAll({ page = 1, limit = 10, email = null } = {}) {
        const offset = (page - 1) * limit;
        let sql = `SELECT id, name, email, subject, message, created_at FROM contacts`;
        let countSql = `SELECT COUNT(*) AS total FROM contacts`;
        const params = [];
        const countParams = [];

        if (email) {
            sql += ` WHERE email LIKE ?`;
            countSql += ` WHERE email LIKE ?`;
            params.push(`%${email}%`);
            countParams.push(`%${email}%`);
        }

        sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        params.push(Number(limit), Number(offset));

        const [rows] = await db.query(sql, params);
        const [countRows] = await db.query(countSql, countParams);
        const total = countRows[0].total;

        return {
            contacts: rows,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    /**
     * Find a contact message by primary key ID
     * @param {number} id 
     * @returns {Promise<Object|null>}
     */
    static async findById(id) {
        const sql = `SELECT id, name, email, subject, message, created_at FROM contacts WHERE id = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Delete a contact message by ID
     * @param {number} id 
     * @returns {Promise<boolean>} True if row was deleted
     */
    static async deleteById(id) {
        const sql = `DELETE FROM contacts WHERE id = ?`;
        const [result] = await db.execute(sql, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = ContactModel;
