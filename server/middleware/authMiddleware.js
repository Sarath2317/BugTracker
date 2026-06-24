const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        let token;

        // Check if Authorization header exists
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // If no token found
        if (!token) {
            return res.status(401).json({
                message: "No Token Found"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Not Authorized, Invalid Token"
        });
    }
};

module.exports = { protect };