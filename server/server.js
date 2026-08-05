/**
 * server/server.js
 * Main Express server entry point.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const contactRoutes = require('./routes/contactRoutes');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Security Middlewares
app.use(helmet());

// CORS configuration
const allowedOrigins = [
    process.env.CLIENT_URL || 'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS Policy: Origin not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply general API rate limiter
app.use('/api', apiLimiter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Portfolio Backend API is running smoothly!',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/contact', contactRoutes);

// 404 Route Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Portfolio Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
});
