// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware com verificação opcional de level mínimo
module.exports = function auth(requiredLevel = null) {
    return (req, res, next) => {
        const token = req.headers['authorization']
        if (!token) return res.status(401).json({ message: 'Token não fornecido' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // Se foi exigido um level mínimo, verifica
            if (requiredLevel !== null && decoded.level < requiredLevel) {
                return res.status(403).json({ message: 'Permissão insuficiente' });
            }

            next();
        } catch (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
    };
};
