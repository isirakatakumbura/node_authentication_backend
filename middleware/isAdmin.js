const isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({message: 'Unauthorized. Please log in.'});
        }

        if (req.user.role !== 'superadmin' && req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admin privileges required.'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({message: 'Authorization failed', error: error.message});
    }
};

module.exports = isAdmin;