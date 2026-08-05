/**
 * server/middleware/errorHandler.js
 * Centralized error handler middleware.
 */

const errorHandler = (err, req, res, next) => {
    console.error(`🔴 Server Error:`, err.stack || err.message || err);

    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};

module.exports = errorHandler;
