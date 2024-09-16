import jwt from 'jsonwebtoken';

export const authAdmin = (req, res, next) => {
    try {
        // Log cookies to debug (remove in production)
       // console.log("Cookies received:", req.cookies);

        // Extract token from cookies
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        // Verify token
        const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Check if token is valid and role is 'admin'
        if (!tokenVerified || tokenVerified.role !== "admin") {
            console.log(tokenVerified);
            
            return res.status(403).json({ success: false, message: "Access denied from ADMIN" });

        }

        // Attach decoded token to request object
        req.user = tokenVerified;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(500).json({ message:error.message|| "Internal server error" });
    }
};
