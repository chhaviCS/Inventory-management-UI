const jwt = require("jsonwebtoken");

/**
 * Reusable Authentication Middleware
 * Verifies JWT token from Authorization header (Bearer token)
 * Note: Not applied to existing product APIs in Phase 1 as per requirements.
 */
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"] || req.headers["Authorization"];
        const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token required"
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid or expired token"
                });
            }

            req.user = {
                id: decoded.userId,
                email: decoded.email
            };
            next();
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Authentication error"
        });
    }
};

module.exports = authenticateToken;
