// authMiddleware.js
export default function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Missing Authorization header' });
    }
    const token = authHeader.replace('Bearer ', '').trim();
    if (token !== process.env.AUTH_TOKEN) {
        return res.status(403).json({ message: 'Invalid token' });
    }
    next();
}
