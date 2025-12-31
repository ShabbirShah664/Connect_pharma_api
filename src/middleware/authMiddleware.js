const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    let token;

    console.log('Incoming Auth Header:', req.headers.authorization);
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify our internal JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attached decoded user info (uid, role) to request
            console.log('Decoded Token User:', decoded);
            req.user = decoded;

            next();
        } catch (error) {
            console.error('JWT Verification Error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Not authorized: User role missing' });
        }
        const userRole = req.user.role.toLowerCase();
        const allowedRoles = roles.map(r => r.toLowerCase());

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission.' });
        }
        next();
    };
};

module.exports = { protect, restrictTo };