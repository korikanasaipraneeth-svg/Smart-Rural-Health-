const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Hospital = require('../models/Hospital');

exports.protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        let user;
        if (decoded.role === 'hospital') {
            user = await Hospital.findById(decoded.id);
        } else {
            user = await User.findById(decoded.id);
        }
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
        }
        
        req.user = user;
        // Ensure role is explicitly set on req.user based on token (useful since Hospital model doesn't store role explicitly)
        req.user.role = decoded.role;
        
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: `User role ${req.user.role} is not authorized to access this route` });
        }
        next();
    };
};
