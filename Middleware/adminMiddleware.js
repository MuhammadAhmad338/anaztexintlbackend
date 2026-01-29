// Define the function
const isAdmin = (req, res, next) => {
    // req.user is usually populated by a previous 'verifyToken' middleware
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ 
            success: false, 
            message: "Access denied. Admins only." 
        });
    }
};

// Separate Export at the end
module.exports = { isAdmin };