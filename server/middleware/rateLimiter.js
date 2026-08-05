/**
 * server/middleware/rateLimiter.js
 * Rate limiters for security against spam and DDoS attacks.
 */

const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many contact requests from this IP. Please try again after 15 minutes.'
    }
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many API requests from this IP. Please try again later.'
    }
});

module.exports = {
    contactLimiter,
    apiLimiter
};
